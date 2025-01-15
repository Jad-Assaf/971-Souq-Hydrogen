import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { CaretDown, Sliders } from "@phosphor-icons/react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import type {
  Filter,
  ProductFilter,
} from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";
import type { SyntheticEvent } from "react";
import React, { useState, useEffect, useCallback } from "react";
import Button from "../components/button";
import { Checkbox } from "../components/checkbox";
import { IconCaretDown, IconCaretRight } from "../components/icons";
import { FILTER_URL_PREFIX } from "../lib/const";
import type { AppliedFilter, SortParam } from "../lib/filter";
import { getAppliedFilterLink, getFilterLink, getSortLink } from "../lib/filter";
import { Drawer, useDrawer } from "./drawer";
import { IconFourGrid, IconOneGrid, IconThreeGrid, IconTwoGrid } from "./icon";
import { Input } from "./input";

type DrawerFilterProps = {
  productNumber?: number;
  filters: Filter[];
  appliedFilters?: AppliedFilter[];
  collections?: Array<{ handle: string; title: string }>;
  showSearchSort?: boolean;
  numberInRow?: number;
  onLayoutChange: (number: number) => void;
};

function ListItemFilter({
  option,
  appliedFilters,
}: {
  option: Filter["values"][0];
  appliedFilters: AppliedFilter[];
}) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();

  const isChecked = useCallback(() => {
    return appliedFilters.some(
      (filter) => JSON.stringify(filter.filter) === option.input
    );
  }, [appliedFilters, option.input]);

  const [checked, setChecked] = useState(isChecked());

  useEffect(() => {
    setChecked(isChecked());
  }, [appliedFilters, isChecked]);

  const handleCheckedChange = (checked: boolean) => {
  setChecked(checked);

  // Clean up 'direction' and 'cursor' parameters
  const updatedParams = new URLSearchParams(params.toString());
  updatedParams.delete('direction');
  updatedParams.delete('cursor');

  if (checked) {
    const link = getFilterLink(option.input as string, updatedParams, location);
    navigate(link);
  } else {
    const filter = appliedFilters.find(
      (filter) => JSON.stringify(filter.filter) === option.input
    );
    if (filter) {
      const link = getAppliedFilterLink(filter, updatedParams, location);
      navigate(link);
    }
  }
};

  return (
    <div className="flex gap-2">
      <Checkbox
        checked={checked}
        onCheckedChange={handleCheckedChange}
        label={option.label}
      />
      <span>({option.count})</span>
    </div>
  );
}

export function FiltersDrawer({
  filters = [],
  appliedFilters = [],
  collections = [], // Add collections to props
  onRemoveFilter,
}: Omit<DrawerFilterProps, "children"> & { onRemoveFilter: (filter: AppliedFilter) => void }) {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const filterMarkup = (filter: Filter, option: Filter["values"][0]) => {
    switch (filter.type) {
      case "PRICE_RANGE": {
        let priceFilter = params.get(`${FILTER_URL_PREFIX}price`);
        let price = priceFilter
          ? (JSON.parse(priceFilter) as ProductFilter["price"])
          : undefined;
        let min = price?.min ? Number(price.min) : undefined;
        let max = price?.max ? Number(price.max) : undefined;
        return <PriceRangeFilter min={min} max={max} />;
      }
      default:
        return (
          <ListItemFilter appliedFilters={appliedFilters} option={option} />
        );
    }
  };

  return (
    <div className="text-sm" style={{ position: "sticky", top: "0" }}>
      {/* Collections Menu */}
      {collections.length > 0 && (
        <div className="collections-menu mb-[20px]">
          <h3 className="font-semibold text-lg mb-2">Collections</h3>
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
              Select Collection
              <CaretDown className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
            </MenuButton>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="origin-top-left absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                {collections.map((collection) => (
                  <MenuItem key={collection.handle}>
                    {({ active }) => (
                      <button
                        className={`${active ? "bg-gray-100" : ""
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        onClick={() => navigate(`/collections/${collection.handle}`)}
                      >
                        {collection.title}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      )}

      {/* Applied Filters */}
      {appliedFilters.length > 0 ? (
        <div className="applied-filters mb-4" style={{ minHeight: "100px" }}>
          <h3 className="font-semibold text-lg mb-2">Applied Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {appliedFilters.map((filter, index) => {
              let displayLabel = filter.label;
              try {
                const parsedFilter = JSON.parse(filter.label);
                if (parsedFilter && parsedFilter.value) {
                  displayLabel = parsedFilter.value;
                }
              } catch { }
              displayLabel = displayLabel.replace(/^["'](.+(?=["']$))["']$/, "$1");

              return (
                <div
                  key={`${filter.label}-${index}`}
                  className="bg-gray-100 rounded-full px-3 py-1 flex items-center text-sm"
                >
                  <span className="font-medium mr-1">{displayLabel}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveFilter(filter)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Filters */}
      {filters.map((filter: Filter) => (
        <Disclosure
          as="div"
          key={filter.id}
          className="w-full pt-[20px] border-t border-[#d1d5db]"
        >
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full justify-between items-center mb-2">
                <span className="text-sm uppercase">{filter.label}</span>
                {open ? (
                  <IconCaretDown className="w-4 h-4" />
                ) : (
                  <IconCaretRight className="w-4 h-4" />
                )}
              </DisclosureButton>
              <DisclosurePanel>
                <ul className="space-y-5">
                  {filter.values?.map((option) => (
                    <li key={option.id}>
                      {filterMarkup(filter, option)}
                    </li>
                  ))}
                </ul>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
}

const PRICE_RANGE_FILTER_DEBOUNCE = 500;

function PriceRangeFilter({ max, min }: { max?: number; min?: number }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [minPrice, setMinPrice] = useState<number | undefined>(min);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(max);

  const onChangeMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const newMaxPrice = value ? parseFloat(value) : undefined;
    setMaxPrice(newMaxPrice);
  };

  const onChangeMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const newMinPrice = value ? parseFloat(value) : undefined;
    setMinPrice(newMinPrice);
  };

  const applyFilters = () => {
    const updatedParams = new URLSearchParams(params.toString());

    // Only apply the min price filter if it's a valid number
    if (minPrice !== undefined && !isNaN(minPrice)) {
      updatedParams.set(`${FILTER_URL_PREFIX}price`, JSON.stringify({ min: minPrice, max: maxPrice }));
    } else if (maxPrice !== undefined && !isNaN(maxPrice)) {
      updatedParams.set(`${FILTER_URL_PREFIX}price`, JSON.stringify({ max: maxPrice }));
    } else {
      updatedParams.delete(`${FILTER_URL_PREFIX}price`);
    }

    // Navigate to the new URL with the updated filters
    navigate(`${location.pathname}?${updatedParams.toString()}`);
  };

  const clearFilters = () => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
    const updatedParams = new URLSearchParams(params.toString());
    updatedParams.delete(`${FILTER_URL_PREFIX}price`);
    navigate(`${location.pathname}?${updatedParams.toString()}`);
  };

  return (
    <div className="price-filter-container">
      <div className="price-filter-inputs">
        <label className="price-filter-label" htmlFor="minPrice">
          <span>$</span>
          <Input
            className="price-filter-input"
            name="minPrice"
            type="number"
            value={minPrice ?? ""}
            placeholder="From"
            onChange={onChangeMin}
          />
        </label>
        <label className="price-filter-label" htmlFor="maxPrice">
          <span>$</span>
          <Input
            className="price-filter-input"
            name="maxPrice"
            type="number"
            value={maxPrice ?? ""}
            placeholder="To"
            onChange={onChangeMax}
          />
        </label>
      </div>
      <div className="price-filter-buttons">
        <Button
          className="price-filter-button price-filter-button-apply"
          onClick={applyFilters}
        >
          Apply
        </Button>
        <Button
          className="price-filter-button price-filter-button-clear"
          onClick={clearFilters}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

export function DrawerFilter({
  filters,
  numberInRow,
  onLayoutChange = () => { }, // Default to a no-op function
  appliedFilters = [],
  productNumber = 0,
  showSearchSort = false,
  isDesktop = false,
}: DrawerFilterProps & { isDesktop: boolean }) {
  const { openDrawer, isOpen, closeDrawer } = useDrawer();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();

  const handleRemoveFilter = (filter: AppliedFilter) => {
    console.log("Removing filter:", filter);
    const updatedParams = new URLSearchParams(params.toString());

    // Use the getAppliedFilterLink utility function instead
    const newUrl = getAppliedFilterLink(filter, params, location);
    navigate(newUrl);
  };

  return (
    <div className="py-4 bg-white sticky sm:relative top-0 w-[50%] max-w-[1200px] m-auto" style={{zIndex: '4'}}>
      <div className="gap-4 md:gap-8 flex w-full items-center justify-between">
        <div className="flex gap-2 justify-between flex-row-reverse m-auto w-11/12 rounded-3xl">
          <SortMenu showSearchSort={showSearchSort} />
          {!isDesktop && (
            <Button
              onClick={openDrawer}
              variant="outline"
              className="flex items-center gap-4 border py-2 rounded-3xl"
            >
              <Sliders size={18} />
              <span>Filter</span>
            </Button>
          )}
          {!isDesktop && (
            <Drawer
              open={isOpen}
              onClose={closeDrawer}
              openFrom="bottom"
              heading="Filter"
            >
              <div className="px-5 w-full rounded-t-3xl">
                <FiltersDrawer
                  filters={filters}
                  appliedFilters={appliedFilters}
                  onRemoveFilter={handleRemoveFilter}
                  onLayoutChange={onLayoutChange}
                />
              </div>
            </Drawer>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SortMenu({
  showSearchSort = false,
}: {
  showSearchSort?: boolean;
}) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1500 // Default to a large screen width on the server
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const productSortItems: { label: string; key: SortParam }[] = [
    { label: "Featured", key: "featured" },
    { label: "Price: Low - High", key: "price-low-high" },
    { label: "Price: High - Low", key: "price-high-low" },
    { label: "Best Selling", key: "best-selling" },
    { label: "Newest", key: "newest" },
  ];

  const searchSortItems: { label: string; key: SortParam }[] = [
    { label: "Price: Low - High", key: "price-low-high" },
    { label: "Price: High - Low", key: "price-high-low" },
    { label: "Relevance", key: "relevance" },
  ];

  const items = showSearchSort ? searchSortItems : productSortItems;
  const activeItem = items.find((item) => item.key === params.get("sort")) || items[0];

  const handleSort = (sortKey: SortParam) => {
    const newUrl = getSortLink(sortKey, params, location);
    navigate(newUrl);
  };

  return (
    <Menu as="div" className="relative z-10">
      <MenuButton className="flex items-center gap-1.5 h-10 border border-gray-300 px-4 py-2.5 rounded-full">
        <span className="font-medium">
          {typeof window !== "undefined" && screenWidth > 550 ? `Sort by: ${activeItem.label}` : "Sort"}
        </span>
        <CaretDown />
      </MenuButton>
      <MenuItems
        as="nav"
        className="absolute right-0 top-12 flex h-fit w-40 flex-col gap-2 border border-gray-300 border-line/75 bg-background p-[1px]"
      >
        {items.map((item) => (
          <MenuItem key={item.label}>
            {() => (
              <button
                onClick={() => handleSort(item.key)}
                className={clsx(
                  "block w-full text-left text-base hover:underline underline-offset-4 fltr-btn",
                  activeItem.key === item.key ? "font-bold" : "font-normal"
                )}
              >
                {item.label}
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}