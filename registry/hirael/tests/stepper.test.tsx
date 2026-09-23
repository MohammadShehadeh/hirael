import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import * as base from '@/registry/hirael/bases/base/components/stepper';
import * as radix from '@/registry/hirael/bases/radix/components/stepper';

const registry = {
  radix,
  base,
};

describe.each(Object.entries(registry))('Stepper (%s)', (_, { Stepper, StepperItem, StepperTrigger }) => {
  const setup = (onClick: (event: React.MouseEvent<HTMLButtonElement>) => void) => {
    const onValueChange = vi.fn();
    render(
      <Stepper defaultValue={1} onValueChange={onValueChange}>
        <StepperItem step={1}>
          <StepperTrigger>One</StepperTrigger>
        </StepperItem>
        <StepperItem step={2}>
          <StepperTrigger onClick={onClick}>Two</StepperTrigger>
        </StepperItem>
      </Stepper>,
    );

    return { user: userEvent.setup(), onValueChange };
  };

  it('should run a consumer onClick and still change the step', async () => {
    const onClick = vi.fn();
    const { user, onValueChange } = setup(onClick);
    await user.click(screen.getByRole('button', { name: 'Two' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole('button', { name: 'Two' })).toHaveAttribute('aria-current', 'step');
  });

  it('should skip the step change when the consumer prevents default', async () => {
    const { user, onValueChange } = setup((event) => event.preventDefault());
    await user.click(screen.getByRole('button', { name: 'Two' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
