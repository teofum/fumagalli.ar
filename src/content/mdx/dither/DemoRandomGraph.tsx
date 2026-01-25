'use client';

import cn from 'classnames';
import { useEffect, useState } from 'react';
import Slider from '@/components/ui/Slider';

// Precalculated random array
const noise = [
  0.3355752696192672, -0.0885945672868057, -0.018366641617918233,
  -0.2807422461531063, -0.3201837834294239, 0.12823271209396525,
  0.1962856153741076, 0.48959793937520035, -0.24859065817152592,
  0.07719261654585563, 0.25542426411424923, -0.427941766648418,
  -0.09578367337916394, -0.006558660890175427, 0.2740267067910015,
  0.2542480373602639, -0.15523101377267867, -0.024223832665937306,
  0.000776939924034159, -0.23021991930076813, -0.2977072935379641,
  0.031175256669283224, -0.4548917373774737, 0.007528872261648889,
  0.429868005089739, 0.14803793582891622, 0.40553381473901784,
  0.42011071990376325, 0.2180881637513098, 0.4521525298149991,
  -0.398444940977561, 0.350579471909524, -0.29675973230343045,
  -0.38522542643724356, 0.3384682708447555, 0.14117811219834786,
  -0.04874649269126363, 0.20450274678728997, -0.3886753704744371,
  -0.4637104089355558, -0.2706227848065692, 0.04527160204147951,
  0.16173314281462725, 0.3386488531931299, -0.39087554487656395,
  0.13119468735476947, 0.2548727153760296, 0.3184652813150496,
  -0.36658524295179584, 0.1621801171561862, 0.1234444831955277,
  -0.21068039436368713, -0.20822711612535505, 0.2401707860712723,
  0.1326438345240376, 0.07020279904212379, 0.30840701486393085,
  -0.38958362389789647, 0.3635542649418486, -0.30587946682731804,
  0.11514521249401932, 0.10713238682084203, 0.4688994965502211,
  0.3300856954260788, 0.3799861180061199, 0.041487691887627465,
  -0.48604789958013384, -0.008770841851630906, 0.320445655819085,
  -0.011126017349203932, 0.15204090630685962, -0.47596975966316823,
  0.31299055069819404, -0.4706185477860302, -0.2415545275140384,
  0.2538580074220793, -0.24960862002651263, 0.1904626956300003,
  -0.20078651439875728, 0.49250640087666453, -0.43871668425424515,
  0.42145944851142547, 0.012765703465875244, -0.040889897125666264,
  -0.07953310161756055, -0.09619504730856199, 0.44313034290783726,
  0.44724598054521436, -0.23730683251987794, -0.4662390817618153,
  0.2519874983604051, 0.11353676875789542, 0.015049153406938909,
  0.35482980000496256, 0.1101280651688773, 0.36434851247529065,
  0.052813477648619656, 0.21930838390325358, -0.38927827920711067,
  -0.4211955053925476, 0.25197695784196406, 0.19878339435554526,
  0.1823883012402142, 0.4414103697261932, -0.2033304047721861,
  0.430164005570707, 0.0654270859743521, -0.08711514335324622,
  0.14367320787286542, 0.09493595492267992, 0.16784820481480933,
  0.05680792423455294, -0.24158340448494398, -0.20387176047592326,
  -0.07359333518603328, -0.0782152751400178, 0.16948359428068005,
  -0.04590320090811806, -0.2639696249340523, 0.3134321930225309,
  -0.2017896610351232, 0.22330679683026078, 0.27128981050968903,
  -0.2643518101791108, 0.08086989503856223, -0.3963779474074215,
  0.4387329463683647, 0.17029047892388072, 0.4368787890370036,
  -0.3150045647163353, -0.2814745606136779, -0.27837439905483274,
  -0.2565491437175913, -0.27148337137037015, 0.16687072909970524,
  0.10338840441163077, -0.4460447311667026, 0.1415738148537955,
  -0.33597146498836306, 0.18077416933653778, 0.05268040463822343,
  -0.2732630735715179, 0.4288102521456344, 0.11311616754845066,
  0.07204011297013091, -0.49036514206268944, 0.19391851831462048,
  0.11001903804149848, -0.28612242152231326, -0.34530112456569784,
];

export default function DemoThreshold() {
  const [brightness, setBrightness] = useState(0.35);
  const [k, setK] = useState(0);
  const [n, setN] = useState(15);

  let canvas: HTMLCanvasElement | null = null;

  useEffect(() => {
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      console.warn('Canvas unavailable');
      return;
    }

    const scaling = window.devicePixelRatio;
    const canvasRect = canvas.getBoundingClientRect();
    canvas.width = canvasRect.width * scaling;
    canvas.height = canvasRect.height * scaling;

    const [w, h] = [canvas.width, canvas.height];

    const textColor = '#ffffff';
    const drawColor = '#d00000';
    ctx.lineWidth = 1 * scaling;

    const points = [0].concat(noise.slice(0, Math.min(noise.length, n)), [0]);

    const x = (i: number) => (i / (points.length - 1)) * w;
    const y = (i: number) =>
      h * Math.max(0, Math.min(1, 1 - brightness + (points[i] || 0) * k));

    // Draw threshold line
    ctx.strokeStyle = textColor;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    // Draw brightness line
    ctx.strokeStyle = drawColor;
    ctx.beginPath();
    ctx.moveTo(0, y(0));
    for (let i = 0; i < points.length - 1; i++) {
      const x_mid = (x(i) + x(i + 1)) / 2;
      const y_mid = (y(i) + y(i + 1)) / 2;
      const cp_x1 = (x_mid + x(i)) / 2;
      const cp_x2 = (x_mid + x(i + 1)) / 2;

      ctx.quadraticCurveTo(cp_x1, y(i), x_mid, y_mid);
      ctx.quadraticCurveTo(cp_x2, y(i + 1), x(i + 1), y(i + 1));
    }
    ctx.stroke();

    // Draw threshold dots
    const size = Math.max(
      2 * scaling,
      Math.min(2 * scaling, (w / points.length / 2) * 0.75),
    );

    for (let i = 1; i < points.length - 1; i++) {
      ctx.fillStyle = y(i) < h / 2 ? 'white' : 'black';

      ctx.beginPath();
      ctx.ellipse(x(i), y(i), size, size, 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    }
  }, [canvas, n, k, brightness]);

  const points = noise.slice(0, Math.min(noise.length, n));
  const average =
    points.map((point) => brightness - point * k).filter((point) => point > 0.5)
      .length / points.length;

  return (
    <div className="demo font-sans text-base">
      <div className="flex flex-col gap-0.5">
        <div className="flex flex-row gap-0.5">
          <div
            className="bevel-content py-1 px-2 flex-1 h-12"
            style={{ backgroundColor: `hsl(0, 0%, ${brightness * 100}%)` }}
          >
            <span
              className={cn({
                'text-white': brightness < 0.5,
                'text-black': brightness >= 0.5,
              })}
            >
              Target
            </span>
          </div>
          <div
            className="bevel-content py-1 px-2 flex-1 h-12"
            style={{ backgroundColor: `hsl(0, 0%, ${average * 100}%)` }}
          >
            <span
              className={cn({
                'text-white': average < 0.5,
                'text-black': average >= 0.5,
              })}
            >
              Sample average
            </span>
          </div>
        </div>

        <div className="bevel-content p-0.5">
          <canvas className="w-64 h-40" ref={(el) => (canvas = el)} />
        </div>
      </div>

      <div className="demo-controls">
        <label className="demo-label">
          <span className="w-16">Brightness</span>
          <Slider
            min={0}
            max={1}
            step={0.005}
            value={brightness}
            onValueChange={setBrightness}
          />
        </label>

        <label className="demo-label">
          <span className="w-16">Samples</span>
          <Slider min={15} max={150} step={1} value={n} onValueChange={setN} />
        </label>

        <label className="demo-label">
          <span className="w-16">k={k.toFixed(2)}</span>
          <Slider min={0} max={1} step={0.01} value={k} onValueChange={setK} />
        </label>
      </div>
    </div>
  );
}
