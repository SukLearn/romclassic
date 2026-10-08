import { useEffect, useId, useMemo, useRef, useState } from "react";
import { translateMessage } from "./i18n";

export type ProductOption = {
  id: string;
  name: string;
  available_quantity?: number;
  warehouse_available_quantity?: number;
  warehouse_quantity?: number;
};

export function ProductSearch({
  products,
  value,
  onChange,
  quantityField = "available_quantity",
  disabled = false,
  placeholder = "Search products…",
}: {
  products: ProductOption[];
  value: string;
  onChange: (id: string) => void;
  quantityField?: "available_quantity" | "warehouse_available_quantity" | "warehouse_quantity";
  disabled?: boolean;
  placeholder?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const selected = products.find((product) => product.id === value);
  const matches = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return products.filter((product) =>
      product.name.toLocaleLowerCase().includes(search),
    );
  }, [products, query]);
  const expanded = open && !disabled;
  const activeIndex = highlighted < matches.length ? highlighted : -1;

  useEffect(() => {
    input.current?.setCustomValidity(
      !disabled && !selected && query
        ? translateMessage("Select a product from the suggestions.")
        : "",
    );
  }, [disabled, selected, query]);

  useEffect(() => {
    if (expanded && activeIndex >= 0)
      list.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [expanded, activeIndex]);

  const choose = (product: ProductOption) => {
    onChange(product.id);
    setQuery("");
    setOpen(false);
    setHighlighted(-1);
    input.current?.setCustomValidity("");
  };
  return (
    <div className="product-search">
      <label htmlFor={id}>Product</label>
      <input type="hidden" name="productId" value={selected?.id || ""} disabled={disabled} />
      <div className="product-search-control">
        <input
          ref={input}
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={`${id}-options`}
          aria-activedescendant={
            expanded && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
          }
          aria-describedby={selected ? `${id}-quantity` : undefined}
          placeholder={placeholder}
          value={selected?.name ?? query}
          required
          disabled={disabled}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            setHighlighted(-1);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            onChange("");
            setOpen(true);
            setHighlighted(-1);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              if (matches.length)
                setHighlighted(
                  event.key === "ArrowDown"
                    ? (activeIndex + 1) % matches.length
                    : (activeIndex <= 0 ? matches.length : activeIndex) - 1,
                );
            } else if (event.key === "Enter" && expanded && activeIndex >= 0) {
              event.preventDefault();
              choose(matches[activeIndex]);
            } else if (event.key === "Escape" && expanded) {
              event.preventDefault();
              setOpen(false);
            }
          }}
        />
        {selected && (
          <span id={`${id}-quantity`} className="product-availability" title="Available">
            ({selected[quantityField] ?? 0})
          </span>
        )}
      </div>
      {expanded && (
        <ul ref={list} id={`${id}-options`} className="product-search-options" role="listbox" aria-label="Products">
          {matches.map((product, index) => (
            <li
              key={product.id}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={product.id === value}
              className={activeIndex === index ? "is-highlighted" : ""}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => choose(product)}
            >
              <span data-no-translate>{product.name}</span>
              <span className="product-availability" title="Available">
                ({product[quantityField] ?? 0})
              </span>
            </li>
          ))}
          {!matches.length && <li className="product-search-empty" role="presentation">No matching products.</li>}
        </ul>
      )}
    </div>
  );
}
