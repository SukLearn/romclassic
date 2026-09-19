-- Preserve any existing duplicate products and their history, while preventing
-- new names (or renames) that collide after trimming and case folding.
CREATE INDEX IF NOT EXISTS products_normalized_name_idx
  ON products ((lower(btrim(name))));

CREATE FUNCTION reject_duplicate_product_name() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  normalized_name text := lower(btrim(NEW.name));
BEGIN
  IF normalized_name IS NULL OR normalized_name = '' THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      CONSTRAINT = 'products_name_not_blank',
      MESSAGE = 'Product name cannot be blank';
  END IF;

  -- An unchanged legacy name must not prevent unrelated edits to a product.
  IF TG_OP = 'UPDATE' THEN
    IF normalized_name = lower(btrim(OLD.name)) THEN
      RETURN NEW;
    END IF;
  END IF;

  -- Serialize checks for the same name so simultaneous requests cannot both
  -- create a duplicate before either transaction commits.
  PERFORM pg_advisory_xact_lock(hashtextextended(normalized_name, 0));
  IF EXISTS (
    SELECT 1 FROM products
    WHERE lower(btrim(name)) = normalized_name
      AND id IS DISTINCT FROM NEW.id
  ) THEN
    RAISE EXCEPTION USING
      ERRCODE = '23505',
      CONSTRAINT = 'products_name_unique_normalized',
      MESSAGE = 'A product with this name already exists';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER products_unique_name_guard
BEFORE INSERT OR UPDATE OF name ON products
FOR EACH ROW EXECUTE FUNCTION reject_duplicate_product_name();
