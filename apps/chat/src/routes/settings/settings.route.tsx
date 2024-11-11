import { BellRing, Bot, Database, Shield, Trash2, UserCircle } from 'lucide-react';
import { useState } from 'react';

import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { RouteMetaTags } from '~/routes/shared';

const SETTINGS_SECTIONS = [
  { id: 'account', label: 'Account Settings', icon: UserCircle },
  { id: 'security', label: 'Security & Privacy', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: BellRing },
  { id: 'data', label: 'Data Management', icon: Database },
] as const;

export function SettingsRoute() {
  const t = useI18n().pack.routes.settings;
  const [activeSection, setActiveSection] = useState<typeof SETTINGS_SECTIONS[number]['id']>('account');

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>{t.title}</LayoutHeader>

      <div className="flex gap-6 px-4">
        <aside className="w-64 shrink-0">
          <nav className="space-y-1">
            {SETTINGS_SECTIONS.map(section => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-gray-100'
                }`}
              >
                <section.icon size={18} />
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 space-y-6 max-w-2xl">
          {activeSection === 'account' && (
            <div className="space-y-6">
              <section className="space-y-4 bg-white shadow-sm p-6 rounded-lg">
                <h2 className="font-medium text-lg">Profile Information</h2>
                <div className="gap-4 grid">
                  <div className="gap-2 grid">
                    <label className="text-sm">Email</label>
                    <input type="email" value="user@example.com" readOnly className="uk-input" />
                  </div>
                  <div className="gap-2 grid">
                    <label className="text-sm">Display Name</label>
                    <input type="text" defaultValue="John Doe" className="uk-input" />
                  </div>
                </div>
              </section>

              <section className="space-y-4 bg-white shadow-sm p-6 rounded-lg">
                <h2 className="flex items-center gap-2 font-medium text-lg">
                  <Bot size={20} />
                  Default AI Model
                </h2>
                <div className="gap-2 grid">
                  <label className="text-sm">Select your default AI model</label>
                  <select className="uk-select">
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5">GPT-3.5 Turbo</option>
                    <option value="claude">Claude 2</option>
                    <option value="palm">PaLM 2</option>
                  </select>
                </div>
              </section>

              <section className="space-y-4 bg-white shadow-sm p-6 rounded-lg">
                <h2 className="font-medium text-destructive text-lg">Danger Zone</h2>
                <div className="border-destructive/20 p-4 border rounded-lg">
                  <h3 className="mb-2 font-medium">Delete Account</h3>
                  <p className="mb-4 text-muted-foreground text-sm">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button type="button" className="flex items-center gap-2 uk-button uk-button-danger">
                    <Trash2 size={18} />
                    <span className="font-bold">Delete Account</span>
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeSection === 'data' && (
            <div className="space-y-6">
              <section className="space-y-4 bg-white shadow-sm p-6 rounded-lg">
                <h2 className="font-medium text-lg">Data Export</h2>
                <p className="text-muted-foreground text-sm">
                  Download a copy of your data including your profile information, conversations, and settings.
                </p>
                <button type="button" className="uk-button uk-button-primary">Export Data</button>
              </section>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              <section className="space-y-4 bg-white shadow-sm p-6 rounded-lg">
                <h2 className="font-medium text-lg">Password</h2>
                <button type="button" className="uk-button uk-button-primary">Change Password</button>
              </section>

              <section className="space-y-4 bg-white shadow-sm p-6 rounded-lg">
                <h2 className="font-medium text-lg">Two-Factor Authentication</h2>
                <button type="button" className="uk-button uk-button-secondary">Enable 2FA</button>
              </section>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <section className="space-y-4 bg-white shadow-sm p-6 rounded-lg">
                <h2 className="font-medium text-lg">Email Notifications</h2>
                <div className="space-y-4">
                  {['New messages', 'System updates', 'Newsletter'].map(item => (
                    <label key={item} className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="uk-checkbox" />
                      <span className="text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </PageWithNavigationLayout>
  );
}
