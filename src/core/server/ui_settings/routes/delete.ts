/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { schema } from '@osd/config-schema';

import { IRouter } from '../../http';
import { SavedObjectsErrorHelpers } from '../../saved_objects';
import { CannotOverrideError } from '../ui_settings_errors';
import { UiSettingScope } from '../types';

const validate = {
  params: schema.object({
    key: schema.string(),
  }),
  query: schema.object({
    scope: schema.maybe(
      schema.oneOf([schema.literal(UiSettingScope.GLOBAL), schema.literal(UiSettingScope.USER)])
    ),
  }),
};

export function registerDeleteRoute(router: IRouter) {
  router.delete(
    { path: '/api/opensearch-dashboards/settings/{key}', validate },
    async (context, request, response) => {
      try {
        const uiSettingsClient = context.core.uiSettings.client;

        const { scope } = request.query;

        await uiSettingsClient.remove(request.params.key, scope);

        return response.ok({
          body: {
            settings: await uiSettingsClient.getUserProvided(),
          },
        });
      } catch (error) {
        if (SavedObjectsErrorHelpers.isSavedObjectsClientError(error)) {
          return response.customError({
            body: error,
            statusCode: error.output.statusCode,
          });
        }

        if (error instanceof CannotOverrideError) {
          return response.badRequest({ body: error });
        }

        throw error;
      }
    }
  );
}
