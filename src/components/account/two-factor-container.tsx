'use client';

import { If } from '@/components/misc/if';
import { useAuth } from '@/components/providers/auth-provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { TwoFactorEnableDisable } from './two-factor-enable-disable';
import { TwoFactorScanQrCode } from './two-factor-scan-qr-code';

export function TwoFactorContainer() {
  const auth = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Factor Authentication</CardTitle>
        <CardDescription>
          Set up Multi-Factor Authentication method to further secure your
          account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <If condition={!!auth?.user.twoFactorEnabled}>
          <TwoFactorScanQrCode />
        </If>
        <TwoFactorEnableDisable />
      </CardContent>
    </Card>
  );
}
