/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { StartServicesAccessor } from 'src/core/public';

import { I18nProvider } from '@osd/i18n/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, Switch } from 'react-router-dom';
import { DataPublicPluginStart } from 'src/plugins/data/public';
import { EuiPageContent } from '@elastic/eui';
import { ManagementAppMountParams } from '../../../management/public';

import { OpenSearchDashboardsContextProvider } from '../../../opensearch_dashboards_react/public';
import { CreateDataSourceWizardWithRouter } from '../components/create_data_source_wizard';
import { DataSourceTableWithRouter } from '../components/data_source_table';
import { DataSourceManagementContext } from '../types';
import { EditDataSourceWithRouter } from '../components/edit_data_source';
import { AuthenticationMethodRegistry } from '../auth_registry';

export interface DataSourceManagementStartDependencies {
  data: DataPublicPluginStart;
}

export async function mountManagementSection(
  getStartServices: StartServicesAccessor<DataSourceManagementStartDependencies>,
  params: ManagementAppMountParams & { wrapInPage?: boolean },
  authMethodsRegistry: AuthenticationMethodRegistry
) {
  const [
    { chrome, application, savedObjects, uiSettings, notifications, overlays, http, docLinks },
  ] = await getStartServices();

  const deps: DataSourceManagementContext = {
    chrome,
    application,
    savedObjects,
    uiSettings,
    notifications,
    overlays,
    http,
    docLinks,
    setBreadcrumbs: params.setBreadcrumbs,
    authenticationMethodRegistry: authMethodsRegistry,
  };

  const content = (
    <Router history={params.history}>
      <Switch>
        <Route path={['/create']}>
          <CreateDataSourceWizardWithRouter />
        </Route>
        <Route path={['/:id']}>
          <EditDataSourceWithRouter />
        </Route>
        <Route path={['/']}>
          <DataSourceTableWithRouter />
        </Route>
      </Switch>
    </Router>
  );

  ReactDOM.render(
    <OpenSearchDashboardsContextProvider services={deps}>
      <I18nProvider>
        {params.wrapInPage ? (
          <EuiPageContent hasShadow={false} hasBorder={false} color="transparent">
            {content}
          </EuiPageContent>
        ) : (
          content
        )}
      </I18nProvider>
    </OpenSearchDashboardsContextProvider>,
    params.element
  );

  return () => {
    chrome.docTitle.reset();
    ReactDOM.unmountComponentAtNode(params.element);
  };
}
