import { Form, useNavigate } from "@remix-run/react";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { t, getCurrentLanguage } from "../../src/utils/translate";
import { DateTimePicker } from "../DateTimePicker";
import { format, isValid, parse } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { es } from "date-fns/locale/es";

interface Field {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "datetime-local" | "file";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  accept?: string;
  defaultValue?: string | number | null;
  onChange?: (e: React.ChangeEvent<any>) => void;
}

interface TrackingModalProps {
  babyId: number;
  title: string;
  fields: Field[];
}

export function TrackingModal({ babyId, title, fields }: TrackingModalProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(`/baby/${babyId}`);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [navigate, babyId]);

  const inputClasses =
    "w-full p-2 border rounded bg-black text-white [&>option]:text-black";
  const labelClasses = "block text-sm font-medium mb-1 text-white";

  const handleInvalid = (
    e: React.FormEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    e.currentTarget.setCustomValidity(t("form.errors.required"));
  };

  const handleInput = (
    e: React.FormEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    e.currentTarget.setCustomValidity("");
  };

  const locales = { en: enUS, es };

  const renderField = (field: Field) => {
    switch (field.type) {
      case "select":
        return (
          <select
            id={field.id}
            name={field.id}
            className={inputClasses}
            required={field.required}
            defaultValue={field.defaultValue || ""}
            onChange={field.onChange}
            onInvalid={handleInvalid}
            onInput={handleInput}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <textarea
            id={field.id}
            name={field.id}
            className={inputClasses}
            rows={3}
            placeholder={field.placeholder}
            required={field.required}
            onInvalid={handleInvalid}
            onInput={handleInput}
          />
        );
      case "text":
        return (
          <input
            id={field.id}
            name={field.id}
            type="text"
            className="w-full p-2 border rounded bg-black text-white"
            required={field.required}
            placeholder={field.placeholder}
            onInvalid={handleInvalid}
            onInput={handleInput}
          />
        );
      case "number":
        return (
          <input
            id={`field.${field.id}`}
            name={field.id}
            type="number"
            className="w-full p-2 border rounded bg-black text-white"
            required={field.required}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue || ""}
            min={0}
            step="any"
            onInvalid={handleInvalid}
            onInput={handleInput}
          />
        );
      case "file":
        return (
          <input
            id={field.id}
            name={field.id}
            type="file"
            className="w-full p-2 border rounded bg-black text-white"
            required={field.required}
            accept={field.accept}
            onInvalid={handleInvalid}
            onInput={handleInput}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={() => navigate(`/baby/${babyId}`)}
            className="p-1 hover:bg-gray-800 rounded-full text-white"
            aria-label={t("modal.close")}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <Form method="post" encType="application/x-www-form-urlencoded">
          {fields.map((field) => {
            if (field.type === "datetime-local") {
              const getLocalNow = () => {
                return format(new Date(), "yyyy-MM-dd'T'HH:mm");
              };
              const [dateValue, setDateValue] = useState(
                typeof field.defaultValue === "string" && field.defaultValue
                  ? field.defaultValue
                  : getLocalNow()
              );
              const [pickerOpen, setPickerOpen] = useState(false);
              const lang = getCurrentLanguage() as "en" | "es";
              const locale = locales[lang] || enUS;
              const parsedDate =
                dateValue &&
                isValid(parse(dateValue, "yyyy-MM-dd'T'HH:mm", new Date()))
                  ? parse(dateValue, "yyyy-MM-dd'T'HH:mm", new Date())
                  : null;
              const displayValue = parsedDate
                ? format(parsedDate, "P HH:mm", { locale })
                : t("form.datePicker.placeholder");
              return (
                <div key={field.id} className="mb-4">
                  <label htmlFor={field.id} className={labelClasses}>
                    {field.label}
                  </label>
                  <button
                    type="button"
                    className="w-full p-2 border rounded bg-black text-white text-left mb-2"
                    onClick={() => setPickerOpen(true)}
                    id={field.id}
                  >
                    {displayValue}
                  </button>
                  <DateTimePicker
                    value={dateValue}
                    onChange={(val) => {
                      setDateValue(val);
                      setPickerOpen(false);
                      const hiddenInput = document.getElementById(
                        `field-hidden-${field.id}`
                      ) as HTMLInputElement;
                      if (hiddenInput) hiddenInput.value = val;
                    }}
                    required={field.required}
                    locale={lang}
                    open={pickerOpen}
                    onClose={() => setPickerOpen(false)}
                  />
                  <input
                    id={`field-hidden-${field.id}`}
                    type="hidden"
                    name={field.id}
                    value={dateValue}
                  />
                </div>
              );
            }
            return (
              <div key={field.id} className="mb-4">
                <label htmlFor={field.id} className={labelClasses}>
                  {field.label}
                </label>
                {renderField(field)}
              </div>
            );
          })}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(`/baby/${babyId}`)}
              className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded"
            >
              {t("modal.actions.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t("modal.actions.save")}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
