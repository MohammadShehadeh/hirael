'use client';

import * as React from 'react';

const RepoStarsContext = React.createContext<number | null>(null);

export const RepoStarsProvider = RepoStarsContext.Provider;

export const useRepoStars = () => React.use(RepoStarsContext);
