import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "../../redux/features/users/usersApi";

import {
  useChangePasswordMutation,
  useLogoutMutation,
  useRevokeAllTokensMutation,
} from "../../redux/features/auth/authApi";

import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/features/auth/authSlice";

import PageHeader from "../../components/ui/PageHeader";
import { SkeletonRows } from "../../components/ui/Skeleton";
import { getErrorMessage } from "../../utils/getErrorMessage";

const inputClasses =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10";

const labelClasses = "mb-2 block text-sm font-semibold text-gray-700";

function ProfileField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className={labelClasses}>
        {label}
        {required && <span className="ml-1 text-orange-500">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={inputClasses}
      />
    </div>
  );
}

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [changePassword, { isLoading, error, data: message }] =
    useChangePasswordMutation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const result = await changePassword({
      currentPassword,
      newPassword,
      confirmNewPassword,
    })
      .unwrap()
      .catch(() => null);

    if (result) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <rect x="4" y="10" width="16" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 1 1 8 0v3" />
            </svg>
          </div>

          <div>
            <h3 className="font-bold text-gray-950">Change Password</h3>
            <p className="text-xs text-gray-500">Keep your account secure</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ProfileField
          label="Current password"
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder="Current password"
          type="password"
          required
          autoComplete="current-password"
        />

        <ProfileField
          label="New password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="New password"
          type="password"
          required
          autoComplete="new-password"
        />

        <ProfileField
          label="Confirm password"
          value={confirmNewPassword}
          onChange={setConfirmNewPassword}
          placeholder="Confirm new password"
          type="password"
          required
          autoComplete="new-password"
        />

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600"
          >
            {getErrorMessage(error)}
          </p>
        )}

        {message && (
          <p
            role="status"
            className="rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700"
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Updating..." : "Update Password"}
          {!isLoading && <span>→</span>}
        </button>
      </form>
    </div>
  );
}

function LogOutEverywhereSection() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [revokeAllTokens, { isLoading }] = useRevokeAllTokensMutation();

  const [logoutRequest] = useLogoutMutation();

  const handleClick = async () => {
    await revokeAllTokens()
      .unwrap()
      .catch(() => null);
    await logoutRequest().catch(() => undefined);

    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="rounded-xl border border-red-100 bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 17l5-5-5-5m5 5H3m9-9h6a3 3 0 013 3v12a3 3 0 01-3 3h-6"
            />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-950">Active Sessions</h3>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            Log out from all devices, including this browser.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="mt-4 min-h-10 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Logging out..." : "Log Out Everywhere"}
      </button>
    </div>
  );
}

export default function Profile() {
  const { data: profile, isLoading } = useGetMyProfileQuery();

  const [updateProfile, { isLoading: isSaving, error, isSuccess }] =
    useUpdateMyProfileMutation();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [nidOrPassportNumber, setNidOrPassportNumber] = useState("");
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState("");

  useEffect(() => {
    if (!profile) return;

    setFullName(profile.fullName);
    setPhoneNumber(profile.phoneNumber ?? "");
    setAddress(profile.address ?? "");
    setNidOrPassportNumber(profile.nidOrPassportNumber ?? "");
    setDrivingLicenseNumber(profile.drivingLicenseNumber ?? "");
  }, [profile]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    updateProfile({
      fullName,
      phoneNumber: phoneNumber || undefined,
      address: address || undefined,
      nidOrPassportNumber: nidOrPassportNumber || undefined,
      drivingLicenseNumber: drivingLicenseNumber || undefined,
    });
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="My Profile" />
        <SkeletonRows count={3} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-10">
      {/* Header */}
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information and account security."
      />
      

      {/* Compact Profile Banner */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-2xl font-black text-white">
            {fullName.trim().charAt(0).toUpperCase() || "G"}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
              Account Overview
            </p>

            <h2 className="mt-1 text-lg font-extrabold text-gray-950">
              {fullName || "GoDrive Member"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Keep your information up to date.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-green-700 sm:self-center">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Account Settings
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Left: Profile Form */}
        <div className="space-y-5 lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Information */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21a8 8 0 0 1 16 0" />
                  </svg>
                </div>

                <div>
                  <h2 className="font-extrabold text-gray-950">
                    Personal Information
                  </h2>
                  <p className="text-xs text-gray-500">
                    Your basic contact details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <ProfileField
                  label="Full name"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                />

                <ProfileField
                  label="Phone number"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  placeholder="Enter phone number"
                  type="tel"
                  autoComplete="tel"
                />

                <div className="sm:col-span-2">
                  <ProfileField
                    label="Address"
                    value={address}
                    onChange={setAddress}
                    placeholder="Enter your current address"
                    autoComplete="street-address"
                  />
                </div>
              </div>
            </section>

            {/* Identity Information */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <circle cx="8" cy="11" r="2" />
                    <path d="M6 16c.5-1.5 3.5-1.5 4 0m3-5h5m-5 4h5" />
                  </svg>
                </div>

                <div>
                  <h2 className="font-extrabold text-gray-950">
                    Identity & Driving
                  </h2>
                  <p className="text-xs text-gray-500">
                    Required for car reservations
                  </p>
                </div>
              </div>

              <div className="mb-5 rounded-lg border border-orange-100 bg-orange-50 px-4 py-3">
                <p className="text-xs leading-5 text-orange-800">
                  Your NID/Passport and Driving License information must be
                  provided before booking a car.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <ProfileField
                  label="NID / Passport number"
                  value={nidOrPassportNumber}
                  onChange={setNidOrPassportNumber}
                  placeholder="Enter ID number"
                />

                <ProfileField
                  label="Driving license number"
                  value={drivingLicenseNumber}
                  onChange={setDrivingLicenseNumber}
                  placeholder="Enter license number"
                />
              </div>
            </section>

            {/* Feedback */}
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
              >
                {getErrorMessage(error)}
              </p>
            )}

            {isSuccess && (
              <p
                role="status"
                className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
              >
                Profile saved successfully.
              </p>
            )}

            {/* Save */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/15 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSaving ? "Saving changes..." : "Save Changes"}
                {!isSaving && <span>→</span>}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Security Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-6">
          <div>
            <h2 className="text-lg font-extrabold text-gray-950">
              Account Security
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your password and sessions.
            </p>
          </div>

          <ChangePasswordSection />

          <LogOutEverywhereSection />
        </aside>
      </div>
    </div>
  );
}
