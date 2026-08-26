"use no memo";
"use client";

import { Button } from "@/registry/hirael/ui/button";
import type { DataTableFeatures } from "./data-table-features";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/registry/hirael/ui/field";
import { Input } from "@/registry/hirael/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/hirael/ui/popover";
import { Separator } from "@/registry/hirael/ui/separator";
import { Slider } from "@/registry/hirael/ui/slider";
import { cn } from "@/lib/utils";
import type { Column, RowData } from "@tanstack/react-table";
import { PlusCircle, XCircle } from "lucide-react";
import * as React from "react";

interface Range {
  min: number;
  max: number;
}

type RangeValue = [number, number];

const getIsValidRange = (value: unknown): value is RangeValue => {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
};

const parseValuesAsNumbers = (value: unknown): RangeValue | undefined => {
  if (!Array.isArray(value) || value.length !== 2) return undefined;

  const parsed = value.map((v) => {
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim() !== "") return Number(v);
    return Number.NaN;
  });

  if (parsed.every((n) => Number.isFinite(n))) {
    return [parsed[0], parsed[1]];
  }

  return undefined;
};

interface DataTableSliderFilterProps<TData extends RowData> {
  column: Column<DataTableFeatures, TData>;
  title?: string;
}

export const DataTableSliderFilter = <TData extends RowData>({
  column,
  title,
}: DataTableSliderFilterProps<TData>) => {
  const id = React.useId();

  const columnFilterValue = parseValuesAsNumbers(column.getFilterValue());

  const defaultRange = column.columnDef.meta?.range;
  const unit = column.columnDef.meta?.unit;

  const { min, max, step } = React.useMemo<Range & { step: number }>(() => {
    let minValue = 0;
    let maxValue = 100;

    if (defaultRange && getIsValidRange(defaultRange)) {
      [minValue, maxValue] = defaultRange;
    } else {
      const values = column.getFacetedMinMaxValues();
      if (values && Array.isArray(values) && values.length === 2) {
        const [facetMinValue, facetMaxValue] = values;
        if (
          typeof facetMinValue === "number" &&
          typeof facetMaxValue === "number"
        ) {
          minValue = facetMinValue;
          maxValue = facetMaxValue;
        }
      }
    }

    const rangeSize = maxValue - minValue;
    const step =
      rangeSize <= 20
        ? 1
        : rangeSize <= 100
          ? Math.ceil(rangeSize / 20)
          : Math.ceil(rangeSize / 50);

    return { min: minValue, max: maxValue, step };
  }, [column, defaultRange]);

  const range = React.useMemo((): RangeValue => {
    return columnFilterValue ?? [min, max];
  }, [columnFilterValue, min, max]);

  const [fromDraft, setFromDraft] = React.useState<string | null>(null);
  const [toDraft, setToDraft] = React.useState<string | null>(null);

  const formatValue = React.useCallback((value: number) => {
    return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }, []);

  const commitFrom = React.useCallback(() => {
    if (fromDraft === null) return;
    const numValue = Number(fromDraft);
    if (fromDraft.trim() !== "" && Number.isFinite(numValue)) {
      const clamped = Math.min(Math.max(numValue, min), range[1]);
      column.setFilterValue([clamped, range[1]]);
    }
    setFromDraft(null);
  }, [fromDraft, column, min, range]);

  const commitTo = React.useCallback(() => {
    if (toDraft === null) return;
    const numValue = Number(toDraft);
    if (toDraft.trim() !== "" && Number.isFinite(numValue)) {
      const clamped = Math.min(Math.max(numValue, range[0]), max);
      column.setFilterValue([range[0], clamped]);
    }
    setToDraft(null);
  }, [toDraft, column, max, range]);

  const onSliderValueChange = React.useCallback(
    (value: RangeValue) => {
      if (Array.isArray(value) && value.length === 2) {
        setFromDraft(null);
        setToDraft(null);
        column.setFilterValue(value);
      }
    },
    [column],
  );

  const onReset = React.useCallback(() => {
    setFromDraft(null);
    setToDraft(null);
    column.setFilterValue(undefined);
  }, [column]);

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) {
          setFromDraft(null);
          setToDraft(null);
        }
      }}
    >
      <div className="flex items-center">
        {columnFilterValue ? (
          <Button
            variant="outline"
            size="sm"
            aria-label={`Clear ${title} filter`}
            data-slot="data-table-slider-filter-reset"
            className="rounded-e-none border-e-0 border-dashed px-2"
            onClick={onReset}
          >
            <XCircle />
          </Button>
        ) : null}
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            data-slot="data-table-slider-filter"
            className={cn(
              "border-dashed font-normal",
              columnFilterValue && "rounded-s-none",
            )}
          >
            {columnFilterValue ? null : <PlusCircle />}
            <span>{title}</span>
            {columnFilterValue ? (
              <>
                <Separator
                  orientation="vertical"
                  className="mx-0.5 data-[orientation=vertical]:h-4"
                />
                {formatValue(columnFilterValue[0])} -{" "}
                {formatValue(columnFilterValue[1])}
                {unit ? ` ${unit}` : ""}
              </>
            ) : null}
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent align="start" className="flex w-auto flex-col gap-4">
        <FieldSet className="gap-3">
          <FieldLegend variant="label" className="leading-none">
            {title}
          </FieldLegend>
          <div className="flex items-center gap-4">
            <Field className="w-auto">
              <FieldLabel htmlFor={`${id}-from`} className="sr-only">
                From
              </FieldLabel>
              <div className="relative">
                <Input
                  id={`${id}-from`}
                  type="number"
                  aria-valuemin={min}
                  aria-valuemax={max}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={min.toString()}
                  min={min}
                  max={max}
                  value={fromDraft ?? range[0].toString()}
                  onChange={(event) => setFromDraft(event.target.value)}
                  onBlur={commitFrom}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      commitFrom();
                    }
                  }}
                  className={cn("h-8 w-24", unit && "pe-8")}
                />
                {unit && (
                  <span className="absolute top-0 bottom-0 end-0 flex items-center rounded-e-md bg-accent px-2 text-muted-foreground text-sm">
                    {unit}
                  </span>
                )}
              </div>
            </Field>
            <Field className="w-auto">
              <FieldLabel htmlFor={`${id}-to`} className="sr-only">
                to
              </FieldLabel>
              <div className="relative">
                <Input
                  id={`${id}-to`}
                  type="number"
                  aria-valuemin={min}
                  aria-valuemax={max}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={max.toString()}
                  min={min}
                  max={max}
                  value={toDraft ?? range[1].toString()}
                  onChange={(event) => setToDraft(event.target.value)}
                  onBlur={commitTo}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      commitTo();
                    }
                  }}
                  className={cn("h-8 w-24", unit && "pe-8")}
                />
                {unit && (
                  <span className="absolute top-0 bottom-0 end-0 flex items-center rounded-e-md bg-accent px-2 text-muted-foreground text-sm">
                    {unit}
                  </span>
                )}
              </div>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor={`${id}-slider`} className="sr-only">
              {title} slider
            </FieldLabel>
            <Slider
              id={`${id}-slider`}
              min={min}
              max={max}
              step={step}
              value={range}
              onValueChange={onSliderValueChange}
            />
          </Field>
        </FieldSet>
        <Button
          aria-label={`Clear ${title} filter`}
          variant="outline"
          size="sm"
          onClick={onReset}
        >
          Clear
        </Button>
      </PopoverContent>
    </Popover>
  );
};
