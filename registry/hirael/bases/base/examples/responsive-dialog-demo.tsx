'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/registry/hirael/bases/base/components/responsive-dialog';

const ResponsiveDialogDemo = () => {
  const t = useT();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('Mohammad Shehadeh');

  return (
    <div className="grid justify-items-center gap-3 text-center">
      <ResponsiveDialog open={open} onOpenChange={setOpen}>
        <ResponsiveDialogTrigger render={<Button variant="outline" />}>
          {t({ en: 'Edit profile', ar: 'تعديل الملف الشخصي' })}
        </ResponsiveDialogTrigger>
        <ResponsiveDialogContent>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              setName(String(new FormData(event.currentTarget).get('name') ?? name));
              setOpen(false);
            }}
          >
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>{t({ en: 'Edit profile', ar: 'تعديل الملف الشخصي' })}</ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                {t({
                  en: 'A dialog on wide screens, a drawer on phones.',
                  ar: 'نافذة حوار على الشاشات العريضة، ودرج على الهواتف.',
                })}
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>
            <ResponsiveDialogBody>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="responsive-dialog-name">{t({ en: 'Name', ar: 'الاسم' })}</FieldLabel>
                  <Input id="responsive-dialog-name" name="name" defaultValue={name} autoComplete="name" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="responsive-dialog-handle">
                    {t({ en: 'Username', ar: 'اسم المستخدم' })}
                  </FieldLabel>
                  <Input id="responsive-dialog-handle" name="handle" defaultValue="mohammadshhadeh" dir="ltr" />
                </Field>
              </FieldGroup>
            </ResponsiveDialogBody>
            <ResponsiveDialogFooter>
              <ResponsiveDialogClose render={<Button type="button" variant="outline" />}>
                {t({ en: 'Cancel', ar: 'إلغاء' })}
              </ResponsiveDialogClose>
              <Button type="submit">{t({ en: 'Save changes', ar: 'حفظ التغييرات' })}</Button>
            </ResponsiveDialogFooter>
          </form>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
      <p className="text-sm text-muted-foreground">
        {t({ en: 'Signed in as', ar: 'مسجل الدخول باسم' })} <span className="font-medium text-foreground">{name}</span>
      </p>
      <p className="max-w-xs text-xs text-muted-foreground">
        {t({
          en: 'Narrow the window below 768px and open it again to get the drawer.',
          ar: 'صغّر النافذة إلى أقل من 768 بكسل وافتحها مجددًا لترى الدرج.',
        })}
      </p>
    </div>
  );
};

export default ResponsiveDialogDemo;
