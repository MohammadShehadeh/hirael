import { describe, expect, it } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/mention-input';
import * as radix from '@/registry/hirael/bases/radix/components/mention-input';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('getMentions (%s)', (_, { getMentions }) => {
  it.each([
    ['Thanks @john.', ['john']],
    ['@a, @b-', ['a', 'b']],
    ['ping @john.doe and @mary-jane!', ['john.doe', 'mary-jane']],
    ['@user_1? @user_2...', ['user_1', 'user_2']],
    ['mail me at me@hirael.com', []],
  ])('should read %j as %j', (text, expected) => {
    expect(getMentions(text)).toEqual(expected);
  });

  it('should read every trigger it is given', () => {
    expect(getMentions('#design. @mohammad,', ['@', '#'])).toEqual(['design', 'mohammad']);
  });
});
