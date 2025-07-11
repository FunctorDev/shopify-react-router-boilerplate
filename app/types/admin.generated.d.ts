/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types';

export type LayoutQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type LayoutQuery = { shop: Pick<AdminTypes.Shop, 'name' | 'description'> };

interface GeneratedQueryTypes {
  "#graphql\n    query layout {\n      shop {\n        name\n        description\n      }\n    }\n  ": {return: LayoutQuery, variables: LayoutQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
