import React, { CSSProperties, ReactElement, useEffect, useState } from "react";

import PromotionCard from "../components/promotion/PromotionCard";
import { usePromotionsList } from "../contexts/PromotionsList";
import { filterPromotions, sortPromotions } from "../services/PromotionService";
import { Promotion } from "../types/promotion";

const styles: { [identifier: string]: CSSProperties } = {
  container: {
    padding: 15,
    paddingBottom: 0,
    overflow: "auto",
  },
};

export default function PromotionList({
  dimensions,
}: {
  dimensions: { width: string; height: string };
}): ReactElement {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const { state } = usePromotionsList();

  const containerStyles = {
    marginLeft: `calc(100vw - ${dimensions.width})`,
    ...dimensions,
    ...styles.container,
  };

  useEffect(() => {
    const { filter, sort, data } = state;
    const filteredPromotions = filterPromotions(data, filter);
    const sortedPromotions = sortPromotions(filteredPromotions, sort);
    setPromotions(sortedPromotions);
  }, [state]);

  return (
    <div style={containerStyles}>
      {promotions.map((promotion: Promotion) => (
        <PromotionCard key={promotion.id} {...promotion} />
      ))}
    </div>
  );
}
