"use client";

import * as React from "react";
import { Clock, FileText, User, Code, Hash } from "lucide-react";

import {
  AdvancedSearchBar,
  SearchScope,
  SearchField,
  SearchTokens,
  SearchSuggestions,
  SearchSuggestionGroup,
  SearchSuggestion,
} from "@/registry/hirael/ui/advanced-search-bar";

const SCOPES = [
  { value: "all", label: "All" },
  { value: "people", label: "People" },
  { value: "files", label: "Files" },
  { value: "code", label: "Code" },
];

const RECENT = ["payment retry logic", "onboarding flow", "type:pdf invoices"];

const PEOPLE = ["Mary Major", "Richard Roe"];

const FILES = ["Q3 roadmap.pdf", "brand-guidelines.fig"];

export default function AdvancedSearchBarDemo() {
  const [tokens, setTokens] = React.useState(["type:pdf", "owner:mary"]);

  return (
    <div className="grid w-full max-w-xl gap-8">
      <AdvancedSearchBar
        scopes={SCOPES}
        tokens={tokens}
        onTokensChange={setTokens}
      >
        <SearchField placeholder="Search the workspace…">
          <SearchScope />
          <SearchTokens />
        </SearchField>
        <SearchSuggestions>
          <SearchSuggestionGroup label="Recent">
            {RECENT.map((item) => (
              <SearchSuggestion key={item} value={item} icon={<Clock />}>
                {item}
              </SearchSuggestion>
            ))}
          </SearchSuggestionGroup>
          <SearchSuggestionGroup label="People" live>
            {PEOPLE.map((person) => (
              <SearchSuggestion key={person} value={person} icon={<User />}>
                {person}
              </SearchSuggestion>
            ))}
          </SearchSuggestionGroup>
          <SearchSuggestionGroup label="Files" live>
            {FILES.map((file) => (
              <SearchSuggestion key={file} value={file} icon={<FileText />}>
                {file}
              </SearchSuggestion>
            ))}
          </SearchSuggestionGroup>
          <SearchSuggestionGroup label="Filter">
            <SearchSuggestion value="type:pdf" icon={<Hash />}>
              Only PDF files
            </SearchSuggestion>
            <SearchSuggestion value="lang:typescript" icon={<Code />}>
              Code in TypeScript
            </SearchSuggestion>
          </SearchSuggestionGroup>
        </SearchSuggestions>
      </AdvancedSearchBar>

      <AdvancedSearchBar
        scopes={[
          { value: "issues", label: "Issues" },
          { value: "prs", label: "Pull requests" },
        ]}
        defaultScope="issues"
        defaultTokens={["is:open"]}
      >
        <SearchField placeholder="Filter issues…" filters>
          <SearchScope />
          <SearchTokens />
        </SearchField>
        <SearchSuggestions>
          <SearchSuggestionGroup label="Saved">
            <SearchSuggestion value="assigned to me" icon={<User />}>
              Assigned to me
            </SearchSuggestion>
            <SearchSuggestion value="needs review" icon={<Clock />}>
              Needs review
            </SearchSuggestion>
          </SearchSuggestionGroup>
          <SearchSuggestionGroup label="Filter">
            <SearchSuggestion value="is:open" icon={<Hash />}>
              Open only
            </SearchSuggestion>
            <SearchSuggestion value="label:bug" icon={<Hash />}>
              Labeled bug
            </SearchSuggestion>
          </SearchSuggestionGroup>
        </SearchSuggestions>
      </AdvancedSearchBar>
    </div>
  );
}
