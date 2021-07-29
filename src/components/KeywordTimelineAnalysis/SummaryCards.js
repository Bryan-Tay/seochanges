import { Grid, makeStyles, Slider, Tooltip } from "@material-ui/core";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles(() => ({
  gridContainer: { padding: "1rem 0", justifyContent: "center" },
  gridItem: {
    width: "6rem",
    cursor: "default",
    padding: "0.5rem 1rem",
    border: "1px solid #cdcdcd",
    borderRadius: "0.25rem",
  },
  kpiLabel: {
    fontSize: "0.6rem",
    fontWeight: "normal",
    textAlign: "center",
  },
  kpiValue: {
    fontSize: "1rem",
    fontWeight: "bold",
    textAlign: "center",
  },
}));

const KpiCard = ({ label, value, tooltip = null }) => {
  const classes = useStyles();

  return (
    <Tooltip title={tooltip || label}>
      <div className={classes.gridItem}>
        <p className={classes.kpiLabel}>{label}</p>
        <p className={classes.kpiValue}>{Math.round(value * 100) / 100}</p>
      </div>
    </Tooltip>
  );
};

const SummaryCards = ({ low, medium, high }) => {
  const classes = useStyles();

  const [EstimatedVolume, setEstimatedVolume] = useState(0);
  const [TotalNewTraffic, setTotalNewTraffic] = useState(0);
  const [EstimatedConversion, setEstimatedConversion] = useState(0);
  const [EstimatedConversionFactor, setEstimatedConversionFactor] =
    useState(0.05);

  const getEstimatedVolume = (batch) => {
    return Object.values(batch).reduce((acc, curr) => acc + curr.search, 0);
  };

  const getTotalNewTraffic = (batch, factor) => {
    return getEstimatedVolume(batch) * factor * 0.14 * 0.5;
  };

  useEffect(() => {
    setEstimatedVolume(
      getEstimatedVolume(low) +
        getEstimatedVolume(medium) +
        getEstimatedVolume(high)
    );
    setTotalNewTraffic(
      getTotalNewTraffic(low, 0.4) +
        getTotalNewTraffic(medium, 0.3) +
        getTotalNewTraffic(high, 0.3)
    );
    // eslint-disable-next-line
  }, [low, medium, high]);

  useEffect(() => {
    setEstimatedConversion(TotalNewTraffic * EstimatedConversionFactor);
    // eslint-disable-next-line
  }, [TotalNewTraffic, EstimatedConversionFactor]);

  const formatSliderText = (value) => {
    return `${Math.round(value * 1000) / 10}%`;
  };

  return (
    <Grid container spacing={8} className={classes.gridContainer}>
      <Grid item>
        <KpiCard
          label="ESV"
          value={EstimatedVolume}
          tooltip="Estimated Search Volume"
        />
      </Grid>
      <Grid item>
        <KpiCard
          label="TNT"
          value={TotalNewTraffic}
          tooltip="Total New Traffic"
        />
      </Grid>
      <Grid item>
        <div style={{ display: "flex", height: "100%" }}>
          <KpiCard
            label="EC"
            value={EstimatedConversion}
            tooltip="Estimated Conversion"
          />
          <Slider
            min={0.01}
            max={0.05}
            step={0.005}
            defaultValue={0.05}
            orientation="vertical"
            valueLabelDisplay="auto"
            getAriaValueText={formatSliderText}
            valueLabelFormat={formatSliderText}
            aria-labelledby="discrete-slider-small-steps"
            onChange={(e, val) => setEstimatedConversionFactor(val)}
            marks={[
              { value: 0.01, label: "1%" },
              { value: 0.05, label: "5%" },
            ]}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
