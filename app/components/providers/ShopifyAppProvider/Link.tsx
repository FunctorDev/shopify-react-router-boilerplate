import type {
  LinkLikeComponent,
  LinkLikeComponentProps,
} from "@shopify/polaris/build/ts/src/utilities/link";
import React from "react";
import { Link } from "react-router";

const AppLink = React.forwardRef<HTMLAnchorElement, LinkLikeComponentProps>(
  (props, ref) => <Link {...props} to={props.url ?? props.to} ref={ref} />,
) as LinkLikeComponent;

export default AppLink;
