"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  shipmentType: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  shipmentType?: string;
}

export default function FormLayout02() {
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    phone: "",
    address: "",
    shipmentType: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (vals: FormValues): FormErrors => {
    const errs: FormErrors = {};
    if (!vals.name.trim()) errs.name = "Full name is required";
    if (!vals.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)) {
      errs.email = "Enter a valid email address";
    }
    if (!vals.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^[+\d\s\-()]{7,}$/.test(vals.phone)) {
      errs.phone = "Enter a valid phone number";
    }
    if (!vals.address.trim()) errs.address = "Address is required";
    if (!vals.shipmentType) errs.shipmentType = "Please select a shipment type";
    return errs;
  };

  const handleChange = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validate({ ...values, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field as keyof FormErrors] }));
    }
  };

  const handleBlur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validate(values);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field as keyof FormErrors] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const newErrors = validate(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    alert("Form submitted successfully!");
  };

  const getFieldState = (field: keyof FormErrors) => {
    if (!touched[field]) return "default";
    if (errors[field]) return "error";
    return "success";
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Shipment Details</h1>
          <p className="mt-2 text-sm text-white/60">Complete the form below to book your Airpak Express delivery.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div className="sm:col-span-1">
              <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={values.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                aria-invalid={getFieldState("name") === "error"}
                aria-describedby={errors.name ? "name-error" : undefined}
                placeholder="John Doe"
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-lg text-sm bg-white/8 text-white placeholder:text-white/30",
                  "border outline-none transition-all duration-150",
                  "focus:ring-2 focus:ring-white/20 focus:border-white/30",
                  getFieldState("name") === "error"
                    ? "border-red-500/60 focus:ring-red-500/20"
                    : getFieldState("name") === "success"
                    ? "border-green-500/40"
                    : "border-white/12"
                )}
              />
              {touched.name && errors.name ? (
                <p id="name-error" className="mt-1.5 text-xs text-red-400" role="alert">
                  {errors.name}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-white/40">Enter your full name as per IC</p>
              )}
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={values.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                aria-invalid={getFieldState("email") === "error"}
                aria-describedby={errors.email ? "email-error" : undefined}
                placeholder="john@example.com"
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-lg text-sm bg-white/8 text-white placeholder:text-white/30",
                  "border outline-none transition-all duration-150",
                  "focus:ring-2 focus:ring-white/20 focus:border-white/30",
                  getFieldState("email") === "error"
                    ? "border-red-500/60 focus:ring-red-500/20"
                    : getFieldState("email") === "success"
                    ? "border-green-500/40"
                    : "border-white/12"
                )}
              />
              {touched.email && errors.email ? (
                <p id="email-error" className="mt-1.5 text-xs text-red-400" role="alert">
                  {errors.email}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-white/40">We&apos;ll send tracking updates here</p>
              )}
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={values.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                aria-invalid={getFieldState("phone") === "error"}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                placeholder="+60 12 345 6789"
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-lg text-sm bg-white/8 text-white placeholder:text-white/30",
                  "border outline-none transition-all duration-150",
                  "focus:ring-2 focus:ring-white/20 focus:border-white/30",
                  getFieldState("phone") === "error"
                    ? "border-red-500/60 focus:ring-red-500/20"
                    : getFieldState("phone") === "success"
                    ? "border-green-500/40"
                    : "border-white/12"
                )}
              />
              {touched.phone && errors.phone ? (
                <p id="phone-error" className="mt-1.5 text-xs text-red-400" role="alert">
                  {errors.phone}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-white/40">For delivery notifications</p>
              )}
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="shipmentType" className="block text-sm font-medium mb-1.5">
                Shipment Type
              </label>
              <select
                id="shipmentType"
                value={values.shipmentType}
                onChange={(e) => handleChange("shipmentType", e.target.value)}
                onBlur={() => handleBlur("shipmentType")}
                aria-invalid={getFieldState("shipmentType") === "error"}
                aria-describedby={errors.shipmentType ? "shipmentType-error" : undefined}
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-lg text-sm bg-white/8 text-white",
                  "border outline-none transition-all duration-150 appearance-none cursor-pointer",
                  "focus:ring-2 focus:ring-white/20 focus:border-white/30",
                  getFieldState("shipmentType") === "error"
                    ? "border-red-500/60 focus:ring-red-500/20"
                    : getFieldState("shipmentType") === "success"
                    ? "border-green-500/40"
                    : "border-white/12"
                )}
              >
                <option value="" className="bg-neutral-900">
                  Select type
                </option>
                <option value="document" className="bg-neutral-900">
                  Document
                </option>
                <option value="parcel" className="bg-neutral-900">
                  Parcel
                </option>
                <option value="express" className="bg-neutral-900">
                  Express
                </option>
                <option value="freight" className="bg-neutral-900">
                  Freight
                </option>
              </select>
              {touched.shipmentType && errors.shipmentType ? (
                <p id="shipmentType-error" className="mt-1.5 text-xs text-red-400" role="alert">
                  {errors.shipmentType}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-white/40">Choose your delivery speed</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium mb-1.5">
                Pickup Address
              </label>
              <textarea
                id="address"
                value={values.address}
                onChange={(e) => handleChange("address", e.target.value)}
                onBlur={() => handleBlur("address")}
                aria-invalid={getFieldState("address") === "error"}
                aria-describedby={errors.address ? "address-error" : undefined}
                placeholder="123 Jalan Sultan, 50000 Kuala Lumpur"
                rows={3}
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-lg text-sm bg-white/8 text-white placeholder:text-white/30",
                  "border outline-none transition-all duration-150 resize-none",
                  "focus:ring-2 focus:ring-white/20 focus:border-white/30",
                  getFieldState("address") === "error"
                    ? "border-red-500/60 focus:ring-red-500/20"
                    : getFieldState("address") === "success"
                    ? "border-green-500/40"
                    : "border-white/12"
                )}
              />
              {touched.address && errors.address ? (
                <p id="address-error" className="mt-1.5 text-xs text-red-400" role="alert">
                  {errors.address}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-white/40">Full address including postal code</p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-medium transition-all duration-150",
                "bg-white text-black hover:bg-white/90 active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-black"
              )}
            >
              {isSubmitting ? "Submitting..." : "Book Shipment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}