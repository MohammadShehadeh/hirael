"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import {
  AvatarUpload,
  AvatarUploadCropDialog,
  AvatarUploadError,
  AvatarUploadInput,
  AvatarUploadPreview,
  AvatarUploadRemove,
  AvatarUploadTrigger,
} from "@/registry/hirael/components/avatar-upload";

const AvatarUploadDemo = () => {
  const t = useT();
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const [logo, setLogo] = React.useState<string | null>(null);

  const dialogCopy = {
    title: t({ en: "Adjust your photo", ar: "اضبط صورتك" }),
    description: t({
      en: "Drag to reposition. Scroll or use the slider to zoom.",
      ar: "اسحب لتغيير الموضع. مرّر أو استخدم شريط التمرير للتكبير.",
    }),
    confirmLabel: t({ en: "Apply", ar: "تطبيق" }),
    cancelLabel: t({ en: "Cancel", ar: "إلغاء" }),
    zoomLabel: t({ en: "Zoom", ar: "تكبير" }),
  };

  const errorMessages = t({
    en: {
      type: "That file type is not supported.",
      size: "Image must be under 2 MB.",
      read: "Could not read that file.",
    },
    ar: {
      type: "نوع الملف غير مدعوم.",
      size: "يجب أن تكون الصورة أقل من 2 ميغابايت.",
      read: "تعذّر قراءة الملف.",
    },
  });

  return (
    <div className="grid w-full max-w-xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Profile photo · initials fallback, circle crop",
            ar: "صورة الملف الشخصي · أحرف بديلة، قص دائري",
          })}
        </p>
        <div className="flex items-center gap-5 rounded-md border border-border bg-card p-4">
          <AvatarUpload
            value={avatar}
            onValueChange={setAvatar}
            shape="circle"
            size={88}
            maxSize={2 * 1024 * 1024}
          >
            <AvatarUploadPreview
              fallback="MS"
              alt={t({ en: "Profile photo", ar: "صورة الملف الشخصي" })}
            >
              <AvatarUploadTrigger>
                {t({ en: "Upload photo", ar: "رفع صورة" })}
              </AvatarUploadTrigger>
              <AvatarUploadRemove
                aria-label={t({ en: "Remove photo", ar: "إزالة الصورة" })}
              />
            </AvatarUploadPreview>
            <AvatarUploadInput />
            <AvatarUploadCropDialog {...dialogCopy} />
            <AvatarUploadError messages={errorMessages} />
          </AvatarUpload>
          <div className="grid gap-1">
            <p className="text-sm font-medium text-foreground">
              {t({ en: "Mohammad Shehadeh", ar: "محمد شحادة" })}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {t({
                en: "Click or drop an image. PNG or JPG, up to 2 MB.",
                ar: "انقر أو أسقط صورة. PNG أو JPG، حتى 2 ميغابايت.",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Workspace logo · square, button trigger",
            ar: "شعار مساحة العمل · مربع، زر رفع",
          })}
        </p>
        <div className="grid gap-4 rounded-md border border-border bg-card p-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <AvatarUpload
            value={logo}
            onValueChange={setLogo}
            shape="square"
            size={72}
            outputSize={256}
            accept="image/png,image/svg+xml,image/jpeg"
          >
            <AvatarUploadPreview
              fallback="AC"
              alt={t({ en: "Workspace logo", ar: "شعار مساحة العمل" })}
              className="rounded-lg"
            >
              <AvatarUploadRemove
                aria-label={t({ en: "Remove logo", ar: "إزالة الشعار" })}
              />
            </AvatarUploadPreview>
            <AvatarUploadInput />
            <AvatarUploadCropDialog
              {...dialogCopy}
              title={t({ en: "Crop the logo", ar: "قص الشعار" })}
            />
            <AvatarUploadError messages={errorMessages} />
            <AvatarUploadTrigger variant="button" className="w-full">
              {logo
                ? t({ en: "Replace", ar: "استبدال" })
                : t({ en: "Upload logo", ar: "رفع الشعار" })}
            </AvatarUploadTrigger>
          </AvatarUpload>
          <div className="grid gap-1">
            <p className="text-sm font-medium text-foreground">Acme Cloud</p>
            <p className="text-[11px] text-muted-foreground">
              {t({
                en: "Shown in the sidebar and on invoices. Square works best.",
                ar: "يظهر في الشريط الجانبي وعلى الفواتير. المربع هو الأنسب.",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarUploadDemo;
