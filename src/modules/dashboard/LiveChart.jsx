import { useEffect, useRef, useState } from "react";

import { createChart } from "lightweight-charts";

import GlassPanel from "../../components/ui/GlassPanel";

import { useMarket } from "../../state/marketStore.jsx";

export default function LiveChart() {
  const chartRef = useRef(null);

  const market = useMarket();

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    price: 0,
  });

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,

      height: 420,

      layout: {
        background: {
          color: "transparent",
        },

        textColor: "#94a3b8",
      },

      grid: {
        vertLines: {
          color: "rgba(255,255,255,0.03)",
        },

        horzLines: {
          color: "rgba(255,255,255,0.03)",
        },
      },

      crosshair: {
        mode: 1,
      },

      rightPriceScale: {
        borderColor: "rgba(255,255,255,0.08)",
      },

      timeScale: {
        borderColor: "rgba(255,255,255,0.08)",
      },
    });

    // ✅ V4 API
    const series = chart.addAreaSeries({
      lineColor: "#00ffaa",

      topColor: "rgba(0,255,170,0.35)",

      bottomColor: "rgba(0,255,170,0.02)",

      lineWidth: 2,
    });

    const data = [];

    const now = Math.floor(Date.now() / 1000);

    let base = 145;

    for (let i = 180; i >= 0; i--) {
      base += (Math.random() - 0.5) * 0.6;

      data.push({
        time: now - i * 60,

        value: base,
      });
    }

    series.setData(data);

    chart.timeScale().fitContent();

    chart.subscribeCrosshairMove((param) => {
      if (!param.point || !param.time) {
        setTooltip((p) => ({
          ...p,
          visible: false,
        }));

        return;
      }

      const price = param.seriesData.get(series)?.value;

      setTooltip({
        visible: true,

        x: param.point.x,

        y: param.point.y,

        price: price?.toFixed(2) || market.price.toFixed(2),
      });
    });

    const interval = setInterval(() => {
      series.update({
        time: Math.floor(Date.now() / 1000),

        value: market.price + Math.random(),
      });
    }, 1200);

    const handleResize = () => {
      chart.applyOptions({
        width: chartRef.current.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);

      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [market.price]);

  return (
    <GlassPanel className="p-5 holo-border">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div
            className="
              text-xs
              uppercase
              tracking-[0.25em]
              text-cyan-400
            "
          >
            LIVE MARKET
          </div>

          <div className="text-2xl text-white mt-2">{market.pair}</div>
        </div>

        <div className="text-emerald-400">LIVE</div>
      </div>

      <div className="relative">
        {/* FLOATING TOOLTIP */}
        {tooltip.visible && (
          <div
            style={{
              left: tooltip.x + 16,
              top: tooltip.y + 16,
            }}
            className="
        absolute

        z-50

        pointer-events-none

        px-3
        py-2

        rounded-xl

        bg-black/70
        backdrop-blur-xl

        border
        border-cyan-400/20

        shadow-[0_0_25px_rgba(0,229,255,0.18)]

        min-w-[120px]
      "
          >
            <div
              className="
          text-[10px]
          tracking-[0.22em]
          text-cyan-400
        "
            >
              PROTOTYPE
            </div>

            <div className="text-white text-lg font-bold mt-1">
              ${tooltip.price}
            </div>

            <div className="text-slate-500 text-xs mt-1">SOL / USD</div>
          </div>
        )}

        <div
          ref={chartRef}
          className="
  w-full
  h-[420px]

  rounded-2xl

  shadow-[0_0_60px_rgba(0,255,163,0.06)]
"
        />
      </div>
    </GlassPanel>
  );
}
