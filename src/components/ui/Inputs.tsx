import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef, useId, ReactNode, ChangeEvent } from "react";
import { cn } from "../../lib/utils";
import { toPersianDigits } from "../../lib/persian";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  id?: string;
  children: ReactNode;
  className?: string;
}

const FieldWrapper = ({ label, error, hint, id, children, className }: FieldWrapperProps) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    {label && (
      <label htmlFor={id} className="text-sm font-medium text-text-base text-right">
        {label}
      </label>
    )}
    {children}
    {error && <span className="text-xs text-danger-base text-right mt-0.5">{error}</span>}
    {hint && !error && <span className="text-xs text-text-muted text-right mt-0.5">{hint}</span>}
  </div>
);

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id: externalId, ...props }, ref) => {
    const id = externalId || useId();
    return (
      <FieldWrapper label={label} error={error} hint={hint} id={id} className={className}>
        <input
          id={id}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-lg border border-surface-border bg-surface-base px-3 py-2 text-sm text-text-base placeholder:text-text-muted",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger-base focus:ring-danger-base",
            className
          )}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id: externalId, ...props }, ref) => {
    const id = externalId || useId();
    return (
      <FieldWrapper label={label} error={error} hint={hint} id={id} className={className}>
        <textarea
          id={id}
          ref={ref}
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-surface-border bg-surface-base px-3 py-2 text-sm text-text-base placeholder:text-text-muted",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger-base focus:ring-danger-base",
            className
          )}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { label: string; value: string | number }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, id: externalId, options, ...props }, ref) => {
    const id = externalId || useId();
    return (
      <FieldWrapper label={label} error={error} hint={hint} id={id} className={className}>
        <select
          id={id}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-lg border border-surface-border bg-surface-base px-3 text-sm text-text-base focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger-base focus:ring-danger-base",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FieldWrapper>
    );
  }
);
Select.displayName = "Select";

// NumberInput converts its display to Persian digits while keeping English digits internally or emitting valid numbers
export const NumberInput = forwardRef<HTMLInputElement, InputProps & { value?: number | string }>(
  ({ className, label, error, hint, id: externalId, value, onChange, ...props }, ref) => {
    const id = externalId || useId();
    // Render the input taking advantage of toPersianDigits for display if value is string
    // Because input type=number doesn't gracefully accept Persian digits in all browsers, we use type=text 
    // and handle the parsing in onChange.
    return (
      <FieldWrapper label={label} error={error} hint={hint} id={id} className={className}>
        <input
          id={id}
          type="text"
          ref={ref}
          value={value !== undefined ? toPersianDigits(value.toString()) : ""}
          onChange={onChange}
          dir="ltr"
          className={cn(
            "flex h-10 w-full rounded-lg border border-surface-border bg-surface-base px-3 py-2 text-sm text-text-base placeholder:text-text-muted text-right",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger-base focus:ring-danger-base",
            className
          )}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
NumberInput.displayName = "NumberInput";

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }>(
  ({ className, label, error, id: externalId, ...props }, ref) => {
    const id = externalId || useId();
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={id}
            ref={ref}
            className={cn(
              "h-4 w-4 rounded border-surface-border text-primary-600 focus:ring-primary-500",
              className
            )}
            {...props}
          />
          {label && (
            <label htmlFor={id} className="text-sm font-medium text-text-base select-none cursor-pointer">
              {label}
            </label>
          )}
        </div>
        {error && <span className="text-xs text-danger-base mt-1">{error}</span>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export const Radio = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }>(
  ({ className, label, error, id: externalId, ...props }, ref) => {
    const id = externalId || useId();
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id={id}
            ref={ref}
            className={cn(
              "h-4 w-4 border-surface-border text-primary-600 focus:ring-primary-500",
              className
            )}
            {...props}
          />
          {label && (
            <label htmlFor={id} className="text-sm font-medium text-text-base select-none cursor-pointer">
              {label}
            </label>
          )}
        </div>
        {error && <span className="text-xs text-danger-base mt-1">{error}</span>}
      </div>
    );
  }
);
Radio.displayName = "Radio";

export const Switch = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string }>(
  ({ className, label, checked, onChange, id: externalId, ...props }, ref) => {
    const id = externalId || useId();
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          id={id}
          role="switch"
          aria-checked={checked}
          onClick={(e) => {
            if (onChange) {
               // mock an event
              const mockEvent = { target: { checked: !checked } } as ChangeEvent<HTMLInputElement>;
              onChange(mockEvent);
            }
          }}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
            checked ? "bg-primary-600" : "bg-surface-border",
            className
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              checked ? "-translate-x-5" : "translate-x-0"
            )}
          />
        </button>
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-text-base select-none cursor-pointer">
            {label}
          </label>
        )}
      </div>
    );
  }
);
Switch.displayName = "Switch";
