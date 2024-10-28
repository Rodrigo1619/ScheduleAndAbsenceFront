import { uniqueId } from "lodash";
import React, { useEffect, useState } from "react";
import { Select } from "@material-tailwind/react";

const AsyncSelect = React.forwardRef((props, ref) => {
  const [key, setKey] = useState("");

  useEffect(() => setKey(uniqueId()), [props]);

  return <Select key={key} ref={ref} {...props} />;
});

AsyncSelect.displayName = "AsyncSelect";

export default AsyncSelect;
