-- Keep existing records intact, but prevent future duplicate supplier names.
CREATE INDEX IF NOT EXISTS suppliers_normalized_name_idx
  ON suppliers ((lower(btrim(name))));

CREATE FUNCTION reject_duplicate_supplier_name() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  normalized_name text := lower(btrim(NEW.name));
BEGIN
  IF normalized_name IS NULL OR normalized_name = '' THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      CONSTRAINT = 'suppliers_name_not_blank',
      MESSAGE = 'Supplier name cannot be blank';
  END IF;

  -- Allow an existing legacy duplicate to be edited without renaming it.
  IF TG_OP = 'UPDATE' THEN
    IF normalized_name = lower(btrim(OLD.name)) THEN
      RETURN NEW;
    END IF;
  END IF;

  -- Avoid a race where two requests create the same name concurrently.
  PERFORM pg_advisory_xact_lock(hashtextextended(normalized_name, 0));
  IF EXISTS (
    SELECT 1 FROM suppliers
    WHERE lower(btrim(name)) = normalized_name
      AND id IS DISTINCT FROM NEW.id
  ) THEN
    RAISE EXCEPTION USING
      ERRCODE = '23505',
      CONSTRAINT = 'suppliers_name_unique_normalized',
      MESSAGE = 'A supplier with this name already exists';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER suppliers_unique_name_guard
BEFORE INSERT OR UPDATE OF name ON suppliers
FOR EACH ROW EXECUTE FUNCTION reject_duplicate_supplier_name();
