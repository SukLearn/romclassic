-- Global activity screens sort these tables by newest record. Existing indexes
-- begin with entity/product IDs and cannot support those global sorts.
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx
  ON audit_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS product_events_created_at_idx
  ON product_events(created_at DESC);

CREATE INDEX IF NOT EXISTS inventory_reservations_activity_idx
  ON inventory_reservations(action_date DESC, created_at DESC);
