"use client";

import * as React from "react";
import { FileText, Folder, ImageIcon, User } from "lucide-react";

import { Button } from "@/registry/hirael/ui/button";
import {
  SpotlightSearch,
  SpotlightSearchContent,
  SpotlightSearchEmpty,
  SpotlightSearchFooter,
  SpotlightSearchGroup,
  SpotlightSearchInput,
  SpotlightSearchItem,
  SpotlightSearchResults,
  SpotlightSearchTrigger,
} from "@/registry/hirael/ui/spotlight-search";

export default function SpotlightSearchDemo() {
  const [opened, setOpened] = React.useState<string | null>(null);
  const [controlledOpen, setControlledOpen] = React.useState(false);

  return (
    <div className="grid w-full max-w-xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Grouped results · icons · meta tags
        </p>
        <SpotlightSearch shortcut={null}>
          <SpotlightSearchTrigger asChild>
            <Button variant="outline" className="w-fit">
              Open search
            </Button>
          </SpotlightSearchTrigger>
          <SpotlightSearchContent>
            <SpotlightSearchInput placeholder="Search people, projects, files" />
            <SpotlightSearchResults>
              <SpotlightSearchGroup heading="People">
                <SpotlightSearchItem
                  value="Mona Ali"
                  icon={<User />}
                  description="Product design"
                  meta="Person"
                  onSelect={() => setOpened("Mona Ali")}
                >
                  Mona Ali
                </SpotlightSearchItem>
                <SpotlightSearchItem
                  value="Karim Haddad"
                  icon={<User />}
                  description="Engineering"
                  meta="Person"
                  onSelect={() => setOpened("Karim Haddad")}
                >
                  Karim Haddad
                </SpotlightSearchItem>
              </SpotlightSearchGroup>

              <SpotlightSearchGroup heading="Projects">
                <SpotlightSearchItem
                  value="Atlas redesign"
                  icon={<Folder />}
                  description="Updated 2 hours ago"
                  meta="Project"
                  onSelect={() => setOpened("Atlas redesign")}
                >
                  Atlas redesign
                </SpotlightSearchItem>
                <SpotlightSearchItem
                  value="Mobile onboarding"
                  icon={<Folder />}
                  description="Updated yesterday"
                  meta="Project"
                  onSelect={() => setOpened("Mobile onboarding")}
                >
                  Mobile onboarding
                </SpotlightSearchItem>
              </SpotlightSearchGroup>

              <SpotlightSearchGroup heading="Files">
                <SpotlightSearchItem
                  value="Q3 roadmap.pdf"
                  icon={<FileText />}
                  description="1.2 MB · PDF"
                  meta="File"
                  onSelect={() => setOpened("Q3 roadmap.pdf")}
                >
                  Q3 roadmap.pdf
                </SpotlightSearchItem>
                <SpotlightSearchItem
                  value="Brand kit.png"
                  icon={<ImageIcon />}
                  description="4.8 MB · Image"
                  meta="File"
                  onSelect={() => setOpened("Brand kit.png")}
                >
                  Brand kit.png
                </SpotlightSearchItem>
              </SpotlightSearchGroup>

              <SpotlightSearchEmpty>No matches</SpotlightSearchEmpty>
            </SpotlightSearchResults>
            <SpotlightSearchFooter />
          </SpotlightSearchContent>
        </SpotlightSearch>
        {opened ? (
          <p
            data-slot="spotlight-search-demo-result"
            className="text-sm text-muted-foreground"
          >
            Opened: {opened}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Controlled open
        </p>
        <Button
          variant="outline"
          className="w-fit"
          onClick={() => setControlledOpen(true)}
        >
          Search settings
        </Button>
        <SpotlightSearch
          open={controlledOpen}
          onOpenChange={setControlledOpen}
          shortcut={null}
        >
          <SpotlightSearchContent>
            <SpotlightSearchInput placeholder="Search settings" />
            <SpotlightSearchResults>
              <SpotlightSearchGroup heading="Settings">
                <SpotlightSearchItem
                  value="Appearance theme dark light"
                  description="Theme, accent, density"
                  meta="General"
                  onSelect={() => setOpened("Appearance")}
                >
                  Appearance
                </SpotlightSearchItem>
                <SpotlightSearchItem
                  value="Notifications email push"
                  description="Email and push alerts"
                  meta="General"
                  onSelect={() => setOpened("Notifications")}
                >
                  Notifications
                </SpotlightSearchItem>
                <SpotlightSearchItem
                  value="Members roles access"
                  description="Roles and access"
                  meta="Workspace"
                  onSelect={() => setOpened("Members")}
                >
                  Members
                </SpotlightSearchItem>
              </SpotlightSearchGroup>
              <SpotlightSearchEmpty />
            </SpotlightSearchResults>
            <SpotlightSearchFooter />
          </SpotlightSearchContent>
        </SpotlightSearch>
      </div>
    </div>
  );
}
