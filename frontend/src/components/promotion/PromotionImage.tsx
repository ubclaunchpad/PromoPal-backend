import React, { ReactElement } from "react";
import { Skeleton } from "antd";

import { PromotionImage as PromotionImageProps } from "../../types/Promotion";

export default function PromotionImage({
  src,
}: PromotionImageProps): ReactElement {
  return (
    <div>{src?.length ? <img src={src} alt="" /> : <Skeleton.Image />}</div>
  );
}
