import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, isValid, setHours, setMinutes, getYear } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { es } from "date-fns/locale/es";
import { t } from "../src/utils/translate";

const locales = { en: enUS, es };

interface DateTimePickerProps {
  value: string | null;
  onChange: (val: string) => void;
  locale?: "en" | "es";
  open: boolean;
  onClose: () => void;
}

export function DateTimePicker({
  value,
  onChange,
  locale = "en",
  open,
  onClose,
}: DateTimePickerProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLButtonElement>(null);
  // Only store the selected day (no time)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value && isValid(new Date(value)) ? new Date(value) : undefined
  );
  // Store time separately as strings to allow empty input
  const [tempTime, setTempTime] = useState({
    hour:
      value && isValid(new Date(value))
        ? String(new Date(value).getHours()).padStart(2, "0")
        : String(new Date().getHours()).padStart(2, "0"),
    minute:
      value && isValid(new Date(value))
        ? String(new Date(value).getMinutes()).padStart(2, "0")
        : String(new Date().getMinutes()).padStart(2, "0"),
  });

  const currentLocale = locales[locale] || enUS;

  // Handle date selection (just set the date, no time)
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Always store only the date part (no time)
      setSelectedDate(
        new Date(date.getFullYear(), date.getMonth(), date.getDate())
      );
    }
  };

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow empty string, but only digits otherwise
    if (value === "" || /^\d{0,2}$/.test(value)) {
      setTempTime((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validation for time fields
  const hourNum = parseInt(tempTime.hour, 10);
  const minuteNum = parseInt(tempTime.minute, 10);
  let timeError = "";
  if (tempTime.hour === "" || isNaN(hourNum) || hourNum < 0 || hourNum > 23) {
    timeError =
      t("form.errors.invalidHour") || "Please enter a valid hour (0-23)";
  } else if (
    tempTime.minute === "" ||
    isNaN(minuteNum) ||
    minuteNum < 0 ||
    minuteNum > 59
  ) {
    timeError =
      t("form.errors.invalidMinute") || "Please enter a valid minute (0-59)";
  }

  // Confirm selection: combine selectedDate and tempTime
  const handleConfirm = () => {
    if (selectedDate) {
      // Parse hour/minute, fallback to 0 if invalid
      const hour = parseInt(tempTime.hour, 10);
      const minute = parseInt(tempTime.minute, 10);
      if (
        isNaN(hour) ||
        hour < 0 ||
        hour > 23 ||
        isNaN(minute) ||
        minute < 0 ||
        minute > 59
      ) {
        // Optionally show an error or just return
        return;
      }
      const finalDateTime = setHours(
        setMinutes(new Date(selectedDate), minute),
        hour
      );
      onClose();
      onChange(format(finalDateTime, "yyyy-MM-dd'T'HH:mm"));
    }
  };

  // Cancel selection
  const handleCancel = () => {
    onClose();
  };

  // Set today and current time
  const handleToday = () => {
    const now = new Date();
    setSelectedDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
    setTempTime({
      hour: String(now.getHours()).padStart(2, "0"),
      minute: String(now.getMinutes()).padStart(2, "0"),
    });
  };

  // Focus trap for accessibility
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const focusableEls = popupRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableEls || focusableEls.length === 0) return;
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === firstEl) {
            event.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            event.preventDefault();
            firstEl.focus();
          }
        }
      } else if (event.key === "Escape") {
        onClose();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Close on outside click/touch
  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent | TouchEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [open]);

  // Custom month label to capitalize in Spanish
  const getMonthLabel = (date: Date) => {
    const month = format(date, "LLLL", { locale: currentLocale });
    return month.charAt(0).toUpperCase() + month.slice(1) + ` ${getYear(date)}`;
  };

  if (!open) return null;
  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div
        className="bg-neutral-800 shadow-lg w-full max-w-xs sm:max-w-md rounded-lg border-2 border-neutral-600 animate-fade-in py-4 px-4 max-h-[90vh] overflow-y-auto flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        {/* Selected Date Label */}
        {selectedDate && (
          <div className="mb-2 text-center text-cyan-400 font-semibold">
            {t("form.datePicker.selected") || "Selected"}:{" "}
            {format(selectedDate, "P", { locale: currentLocale })}
          </div>
        )}
        {/* Calendar */}
        <div className="mb-4">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            locale={currentLocale}
            className="w-full"
            formatters={{
              formatCaption: (date) => getMonthLabel(date),
            }}
            classNames={{
              months:
                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-black-600 rounded-md w-8 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-8 w-8 p-0 font-normal rounded-md transition-colors duration-150",
              selected: "bg-cyan-600 text-white font-bold shadow-md",
              day_selected: "bg-cyan-600 text-white font-bold shadow-md",
              day_today: "border border-cyan-400",
              day_outside: "text-gray-400 opacity-50",
              day_disabled: "text-gray-400 opacity-50",
              day_range_middle:
                "aria-selected:bg-gray-100 aria-selected:text-gray-900",
              day_hidden: "invisible",
            }}
          />
        </div>

        {/* Today Button */}
        <button
          type="button"
          onClick={handleToday}
          className="mb-4 w-full py-2 bg-gray-800 text-white rounded hover:bg-cyan-700 transition"
          aria-label={t("form.datePicker.today") || "Today"}
        >
          {t("form.datePicker.today") || "Today"}
        </button>

        {/* Time Picker */}
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            name="hour"
            min={0}
            max={23}
            value={tempTime.hour}
            onChange={handleTimeChange}
            className="w-16 p-2 rounded border border-gray-200 text-black bg-white"
            aria-label={t("form.datePicker.hour")}
          />
          <span className="text-black">:</span>
          <input
            type="number"
            name="minute"
            min={0}
            max={59}
            value={tempTime.minute}
            onChange={handleTimeChange}
            className="w-16 p-2 rounded border border-gray-200 text-black bg-white"
            aria-label={t("form.datePicker.minute")}
          />
        </div>
        {timeError && (
          <div className="text-red-500 text-xs mb-2">{timeError}</div>
        )}

        {/* Sticky button row */}
        <div className="flex justify-end gap-2 pt-2 bg-neutral-800 sticky bottom-0 z-10">
          <button
            type="button"
            onClick={handleCancel}
            className="mr-2 text-gray-300 hover:text-cyan-400"
            aria-label={t("form.datePicker.close") || "Close"}
          >
            {t("form.datePicker.close")}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-cyan-600 text-white px-3 py-1 rounded hover:bg-cyan-700"
            disabled={!selectedDate || !!timeError}
            aria-label={t("form.datePicker.confirm") || "Confirm"}
          >
            {t("form.datePicker.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
