import { useEffect, type CSSProperties } from 'react';
import PageHero from '../../components/PageHero/PageHero';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useDocument } from '../../hooks/useDocument';
import {
  DEFAULT_RESULT_ANALYSIS,
  RESULT_ANALYSIS_COLLECTION,
  RESULT_ANALYSIS_DOC_ID,
  type ResultAnalysisDoc,
} from '../Admin/sections/ResultAnalysisAdmin';
import { resolveContentIcon } from '../../lib/contentIcons';
import { dotTech } from '../../lib/academicDegreeNames';
import { Trophy } from 'lucide-react';

const CHART_TOP = 20;
const CHART_BAR_AREA_HEIGHT = 260;
const CHART_LEFT = 46;
const CHART_BAR_WIDTH = 28;
const CHART_BAR_GAP = 12;
const CHART_BOTTOM = 100;
const chartGridlines = [0, 20, 40, 60, 80, 100];

const statTileStyle: CSSProperties = { background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', textAlign: 'center' };
const statValueStyle: CSSProperties = { fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--color-primary)' };
const statLabelStyle: CSSProperties = { fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 };

export default function ResultAnalysis() {
  const factors = useContentBlocks('result-analysis', 'factors');
  // Admin → Admissions & Campus Info → Results Analysis — Batch Pass Rates.
  // Falls back to the original hardcoded content until an admin saves
  // anything. Everything that used to be derived at module scope from the
  // hardcoded array now has to be derived here instead, since it depends on
  // this live (hook-sourced) data.
  const { data: remoteResult } = useDocument<ResultAnalysisDoc>(RESULT_ANALYSIS_COLLECTION, RESULT_ANALYSIS_DOC_ID);
  const batchPassRates = remoteResult?.batchPassRates?.length ? remoteResult.batchPassRates : DEFAULT_RESULT_ANALYSIS.batchPassRates;
  const chartPlotWidth = batchPassRates.length * (CHART_BAR_WIDTH + CHART_BAR_GAP) - CHART_BAR_GAP;
  const chartWidth = CHART_LEFT + chartPlotWidth + 16;
  const chartHeight = CHART_TOP + CHART_BAR_AREA_HEIGHT + CHART_BOTTOM;
  const highestBatch = batchPassRates.reduce((a, b) => (b.passPercent > a.passPercent ? b : a));
  const lowestBatch = batchPassRates.reduce((a, b) => (b.passPercent < a.passPercent ? b : a));
  const latestBatch = batchPassRates[batchPassRates.length - 1];
  const averagePassPercent = batchPassRates.reduce((sum, b) => sum + b.passPercent, 0) / batchPassRates.length;

  useEffect(() => {
    document.title = 'Results Analysis | VWU';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setTimeout(() => el.classList.add('revealed'), parseInt(el.dataset.delay || '0'));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="result-analysis"
        defaultTitle="Results Analysis"
        defaultSubtitle="Consistent, top-tier academic outcomes with 90%+ annual pass rates across 22+ graduating batches."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Admissions', to: '/admissions' }, { label: 'Results Analysis' }]}
        hideCta={true}
      />

      {/* Batch-wise Pass Percentage */}
      <section id="result-analysis-content" className="section bg-off-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <h2 className="section-title">Batch-Wise Pass Percentage</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Consistent, top-tier outcomes across {batchPassRates.length} graduating batches from {batchPassRates[0].batch} to {latestBatch.batch}.
            </p>
          </div>

          <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-8)' }}>
            {/* Summary stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
              <div style={statTileStyle}>
                <div style={statValueStyle}>{highestBatch.passPercent.toFixed(2)}%</div>
                <div style={statLabelStyle}>Highest — {highestBatch.batch}</div>
              </div>
              <div style={statTileStyle}>
                <div style={statValueStyle}>{averagePassPercent.toFixed(2)}%</div>
                <div style={statLabelStyle}>22-Year Average</div>
              </div>
              <div style={statTileStyle}>
                <div style={statValueStyle}>{lowestBatch.passPercent.toFixed(2)}%</div>
                <div style={statLabelStyle}>Lowest — {lowestBatch.batch}</div>
              </div>
              <div style={statTileStyle}>
                <div style={statValueStyle}>{latestBatch.passPercent.toFixed(2)}%</div>
                <div style={statLabelStyle}>Latest — {latestBatch.batch}</div>
              </div>
            </div>

            {/* Chart */}
            <div style={{ overflowX: 'auto' }}>
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                width={chartWidth}
                height={chartHeight}
                style={{ display: 'block', minWidth: chartWidth, margin: '0 auto' }}
                role="img"
                aria-label="Bar chart of pass percentage by batch, ranging from 87.58% to 99.48%"
              >
                {/* Gridlines + y-axis labels */}
                {chartGridlines.map((g) => {
                  const y = CHART_TOP + CHART_BAR_AREA_HEIGHT - (g / 100) * CHART_BAR_AREA_HEIGHT;
                  return (
                    <g key={g}>
                      <line x1={CHART_LEFT} y1={y} x2={chartWidth - 16} y2={y} stroke="var(--color-light-gray)" strokeWidth={1} />
                      <text x={CHART_LEFT - 10} y={y + 4} textAnchor="end" fontSize={11} fontFamily="var(--font-sans)" fill="var(--color-text-light)">{g}</text>
                    </g>
                  );
                })}

                {/* Bars */}
                {batchPassRates.map((b, i) => {
                  const barHeight = (b.passPercent / 100) * CHART_BAR_AREA_HEIGHT;
                  const x = CHART_LEFT + i * (CHART_BAR_WIDTH + CHART_BAR_GAP);
                  const y = CHART_TOP + CHART_BAR_AREA_HEIGHT - barHeight;
                  const labelY = CHART_TOP + CHART_BAR_AREA_HEIGHT + 16;
                  return (
                    <g key={b.batch}>
                      <rect
                        x={x}
                        y={y}
                        width={CHART_BAR_WIDTH}
                        height={barHeight}
                        rx={4}
                        fill="var(--color-accent)"
                        style={{ transition: 'opacity var(--transition-fast)' }}
                        onMouseEnter={e => { (e.currentTarget as SVGRectElement).style.opacity = '0.75'; }}
                        onMouseLeave={e => { (e.currentTarget as SVGRectElement).style.opacity = '1'; }}
                      >
                        <title>{`${b.batch}: ${b.passPercent.toFixed(2)}%`}</title>
                      </rect>
                      <text
                        x={x + CHART_BAR_WIDTH / 2}
                        y={labelY}
                        textAnchor="end"
                        fontSize={11}
                        fontFamily="var(--font-sans)"
                        fill="var(--color-text-light)"
                        transform={`rotate(-45 ${x + CHART_BAR_WIDTH / 2} ${labelY})`}
                      >
                        {b.batch}
                      </text>
                    </g>
                  );
                })}

                {/* Axis line */}
                <line x1={CHART_LEFT} y1={CHART_TOP + CHART_BAR_AREA_HEIGHT} x2={chartWidth - 16} y2={CHART_TOP + CHART_BAR_AREA_HEIGHT} stroke="var(--color-mid-gray)" strokeWidth={1} />
              </svg>
            </div>

            {/* Exact figures per batch */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 'var(--space-2)', marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-light-gray)' }}>
              {batchPassRates.map((b) => (
                <div key={b.batch} style={{ textAlign: 'center', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', background: 'var(--color-off-white)' }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontWeight: 600 }}>{b.batch}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{b.passPercent.toFixed(2)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Factors */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h2 style={{ color: 'var(--color-white)' }} className="section-title">Supporting Student Achievement</h2>
          </div>
          <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)' }}>
            {factors.map((f) => {
              const Icon = resolveContentIcon(f.icon) || Trophy;
              return (
                <div key={f.id}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', transition: 'all var(--transition-base)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                >
                  <div style={{ marginBottom: 'var(--space-3)', color: 'var(--color-white)' }}><Icon size={32} strokeWidth={1.75} /></div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>{dotTech(f.title)}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{dotTech(f.desc)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </main>
  );
}
