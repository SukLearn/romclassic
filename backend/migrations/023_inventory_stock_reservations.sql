ALTER TABLE inventory_reservations
  ADD COLUMN IF NOT EXISTS holds_stock boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS cancelled_by uuid REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;

ALTER TABLE inventory_reservations
  DROP CONSTRAINT IF EXISTS inventory_reservations_status_check;

ALTER TABLE inventory_reservations
  ADD CONSTRAINT inventory_reservations_status_check
  CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED'));

CREATE INDEX IF NOT EXISTS inventory_reservations_location_pending_idx
  ON inventory_reservations(product_id, warehouse_id, status)
  WHERE status='PENDING' AND holds_stock;
