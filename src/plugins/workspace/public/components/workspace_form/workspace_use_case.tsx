/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback } from 'react';
import { i18n } from '@osd/i18n';
import { EuiCheckableCard, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiText } from '@elastic/eui';
import { WorkspaceUseCase as WorkspaceUseCaseObject } from '../../types';
import { WorkspaceFormErrors } from './types';
import './workspace_use_case.scss';

interface WorkspaceUseCaseCardProps {
  id: string;
  title: string;
  checked: boolean;
  description: string;
  onChange: (id: string) => void;
}

const WorkspaceUseCaseCard = ({
  id,
  title,
  description,
  checked,
  onChange,
}: WorkspaceUseCaseCardProps) => {
  const handleChange = useCallback(() => {
    onChange(id);
  }, [id, onChange]);
  return (
    <EuiCheckableCard
      id={id}
      checkableType="checkbox"
      style={{ height: '100%' }}
      label={title}
      checked={checked}
      className="workspace-use-case-item"
      onChange={handleChange}
      data-test-subj={`workspaceUseCase-${id}`}
    >
      <EuiText color="subdued" size="xs">
        {description}
      </EuiText>
    </EuiCheckableCard>
  );
};

export interface WorkspaceUseCaseProps {
  value: string[];
  onChange: (newValue: string[]) => void;
  formErrors: WorkspaceFormErrors;
  availableUseCases: WorkspaceUseCaseObject[];
}

export const WorkspaceUseCase = ({
  value,
  onChange,
  formErrors,
  availableUseCases,
}: WorkspaceUseCaseProps) => {
  const handleCardChange = useCallback(
    (id: string) => {
      if (!value.includes(id)) {
        onChange([...value, id]);
        return;
      }
      onChange(value.filter((item) => item !== id));
    },
    [value, onChange]
  );

  return (
    <EuiFormRow
      label={i18n.translate('workspace.form.workspaceUseCase.name.label', {
        defaultMessage: 'Use case',
      })}
      isInvalid={!!formErrors.features}
      error={formErrors.features?.message}
      fullWidth
    >
      <EuiFlexGroup>
        {availableUseCases
          .filter((item) => !item.systematic)
          .map(({ id, title, description }) => (
            <EuiFlexItem key={id}>
              <WorkspaceUseCaseCard
                id={id}
                title={title}
                description={description}
                checked={value.includes(id)}
                onChange={handleCardChange}
              />
            </EuiFlexItem>
          ))}
      </EuiFlexGroup>
    </EuiFormRow>
  );
};
