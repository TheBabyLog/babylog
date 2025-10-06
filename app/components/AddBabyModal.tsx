import { useState, useEffect } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { XIcon } from "lucide-react";
import { t, getCurrentLanguage } from "~/src/utils/translate";
import { DateTimePicker } from "./DateTimePicker";
import { format, isValid, parse } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { es } from "date-fns/locale/es";

interface AddBabyModalProps {
  isOpen: boolean;
  onClose: () => void;
  error?: string | null;
}

export function AddBabyModal({ isOpen, onClose, error }: AddBabyModalProps) {
  const navigation = useNavigation();
  const [showParentInvite, setShowParentInvite] = useState(false);
  const [dateValue, setDateValue] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dateError, setDateError] = useState("");

  const isSubmitting = navigation.state === "submitting";

  // Locale setup for date formatting
  const locales = { en: enUS, es };
  const lang = getCurrentLanguage() as "en" | "es";
  const locale = locales[lang] || enUS;

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  // Handle form submission validation
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setDateError("");

    if (!dateValue.trim()) {
      e.preventDefault();
      setDateError("Please select a date of birth");
      return false;
    }

    // Validate date is not in the future
    const selectedDate = new Date(dateValue);
    if (selectedDate > new Date()) {
      e.preventDefault();
      setDateError("Date of birth cannot be in the future");
      return false;
    }

    return true;
  };

  // Reset form state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setDateValue("");
      setDateError("");
      setShowParentInvite(false);
    }
  }, [isOpen]);

  // Close modal on successful submission
  useEffect(() => {
    if (navigation.state === "loading" && navigation.formMethod === "POST") {
      onClose();
    }
  }, [navigation.state, navigation.formMethod, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {t("newBaby.title")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-full text-white"
            aria-label={t("modal.close")}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <Form method="post" className="space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="intent" value="createBaby" />
          {error && (
            <div className="text-red-400 p-3 bg-red-900/20 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              {t("newBaby.fields.firstName")}
              <input
                type="text"
                name="firstName"
                className="mt-2 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              {t("newBaby.fields.lastName")}
              <input
                type="text"
                name="lastName"
                className="mt-2 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              {t("newBaby.fields.dateOfBirth")}
              <button
                type="button"
                className="mt-2 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 text-left hover:bg-gray-700 transition-colors"
                onClick={() => setPickerOpen(true)}
              >
                {dateValue &&
                isValid(parse(dateValue, "yyyy-MM-dd'T'HH:mm", new Date()))
                  ? format(
                      parse(dateValue, "yyyy-MM-dd'T'HH:mm", new Date()),
                      "P",
                      { locale }
                    )
                  : t("form.datePicker.placeholder")}
              </button>
            </label>
            <DateTimePicker
              value={dateValue}
              onChange={(val) => {
                setDateValue(val);
                setPickerOpen(false);
                setDateError(""); // Clear error when date is selected
              }}
              locale={lang}
              open={pickerOpen}
              onClose={() => setPickerOpen(false)}
            />
            {dateError && (
              <div className="text-red-400 text-sm mt-1">{dateError}</div>
            )}
            <input
              type="hidden"
              name="dateOfBirth"
              value={dateValue}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              {t("newBaby.fields.gender")}
              <select
                name="gender"
                className="mt-2 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="girl">{t("newBaby.genderOptions.girl")}</option>
                <option value="boy">{t("newBaby.genderOptions.boy")}</option>
              </select>
            </label>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-white">
              <input
                type="checkbox"
                className="mr-2 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                onChange={(e) => setShowParentInvite(e.target.checked)}
              />
              {t("newBaby.parentInvite.question")}
            </label>
          </div>

          {showParentInvite && (
            <div className="space-y-4 p-4 border border-blue-600 rounded-md bg-blue-900/20">
              <input type="hidden" name="inviteParent" value="true" />
              <p className="text-sm text-blue-300">
                {t("newBaby.parentInvite.description")}
              </p>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  {t("newBaby.parentInvite.emailLabel")}
                  <input
                    type="email"
                    name="parentEmail"
                    className="mt-2 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500"
                    required={showParentInvite}
                  />
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? t("common.loading")
              : showParentInvite
              ? t("newBaby.parentInvite.submitWithInvite")
              : t("newBaby.submit")}
          </button>
        </Form>
      </div>
    </div>
  );
}
