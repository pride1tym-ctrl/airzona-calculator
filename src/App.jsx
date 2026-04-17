import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Calendar, 
  Package, 
  Coins, 
  ArrowRightLeft, 
  Percent, 
  Clock, 
  CheckCircle2, 
  MinusCircle,
  BarChart3,
  ChevronDown,
  Edit3,
  ShieldCheck,
  Building2,
  Info,
  ArrowRight
} from 'lucide-react';

const ITEM_DATA = [
  { name: "통마늘", category: "구근류", price: 6000, baseLoss: 8.0, airLoss: 1.5, baseDays: 30 },
  { name: "깐마늘", category: "구근류", price: 9000, baseLoss: 12.5, airLoss: 4.0, baseDays: 30 },
  { name: "양파", category: "구근류", price: 1200, baseLoss: 4.0, airLoss: 1.8, baseDays: 30 },
  { name: "당근", category: "근채류", price: 1800, baseLoss: 24.0, airLoss: 8.5, baseDays: 30 },
  { name: "호박", category: "과채류", price: 1500, baseLoss: 21.0, airLoss: 7.0, baseDays: 30 },
  { name: "브로콜리", category: "엽채류", price: 4000, baseLoss: 30.0, airLoss: 9.5, baseDays: 30 },
  { name: "깻잎", category: "엽채류", price: 8000, baseLoss: 25.0, airLoss: 11.5, baseDays: 30 },
  { name: "상추", category: "엽채류", price: 3500, baseLoss: 38.0, airLoss: 22.0, baseDays: 30 },
  { name: "사과", category: "과실류", price: 5000, baseLoss: 3.2, airLoss: 1.2, baseDays: 30 },
  { name: "바나나", category: "과실류", price: 2500, baseLoss: 10.5, airLoss: 1.5, baseDays: 20 },
  { name: "딸기", category: "과실류", price: 12000, baseLoss: 18.0, airLoss: 2.2, baseDays: 20 },
];

const App = () => {
  const [selectedItemName, setSelectedItemName] = useState(ITEM_DATA[0].name);
  const [storageDays, setStorageDays] = useState("30");
  const [storageWeight, setStorageWeight] = useState("10000");
  const [wholesalePrice, setWholesalePrice] = useState(ITEM_DATA[0].price.toString());
  const [installCost, setInstallCost] = useState("5,500,000");
  const [annualCycles, setAnnualCycles] = useState("4");

  useEffect(() => {
    const item = ITEM_DATA.find(i => i.name === selectedItemName);
    if (item) setWholesalePrice(item.price.toString());
  }, [selectedItemName]);

  const selectedItem = useMemo(() => ITEM_DATA.find(i => i.name === selectedItemName), [selectedItemName]);
  
  const toNum = (val) => {
    if (typeof val === 'string') return Number(val.replace(/,/g, '')) || 0;
    return Number(val) || 0;
  };

  const calcResults = useMemo(() => {
    if (!selectedItem) return null;
    const days = toNum(storageDays);
    const weight = toNum(storageWeight);
    const price = toNum(wholesalePrice);
    const cost = toNum(installCost);
    const cycles = toNum(annualCycles);

    const totalValue = weight * price;
    const convertedBaseLoss = days > 0 ? (selectedItem.baseLoss / selectedItem.baseDays) * days : 0;
    const convertedAirLoss = days > 0 ? (selectedItem.airLoss / selectedItem.baseDays) * days : 0;

    const baseWasteWeight = weight * (convertedBaseLoss / 100);
    const airWasteWeight = weight * (convertedAirLoss / 100);
    const baseWasteCost = baseWasteWeight * price;
    const airWasteCost = airWasteWeight * price;

    const baseActualValue = totalValue - baseWasteCost;
    const airActualValue = totalValue - airWasteCost;
    const savingPerCycle = baseWasteCost - airWasteCost;
    const reductionRate = convertedBaseLoss > 0 ? ((convertedBaseLoss - convertedAirLoss) / convertedBaseLoss) * 100 : 0;

    const expectedAnnualSaving = savingPerCycle * cycles;
    const roiPeriodYears = expectedAnnualSaving > 0 ? (cost / expectedAnnualSaving) : 0;

    return {
      totalValue, convertedBaseLoss, convertedAirLoss,
      baseWasteWeight, airWasteWeight,
      baseWasteCost, airWasteCost, wasteCostDiff: savingPerCycle,
      baseActualValue, airActualValue, expectedAnnualSaving, roiPeriodYears, reductionRate
    };
  }, [selectedItem, storageDays, storageWeight, wholesalePrice, installCost, annualCycles]);

  const formatNum = (num) => Math.round(num).toLocaleString();
  const formatFloat = (num) => parseFloat(num.toFixed(1));

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9,]+$/.test(value)) {
      setter(value);
    }
  };

  const handleInstallCostChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (rawValue === '' || /^\d+$/.test(rawValue)) {
      setInstallCost(rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    }
  };

  const renderROIPeriod = () => {
    const years = calcResults.roiPeriodYears;
    if (years === 0) return { value: "0", unit: "년" };
    if (years < 1) {
      return { value: Math.ceil(years * 365), unit: "일" };
    }
    return { value: formatFloat(years), unit: "년" };
  };

  const roiInfo = renderROIPeriod();

  // 포인트 컬러 상수
  const POINT_COLOR = "#9f4700";

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 tracking-tight leading-relaxed">
      {/* 1. 타이틀 영역 */}
      <header className="max-w-5xl mx-auto pt-12 pb-8 px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-blue-600 rounded-full" />
              <span className="text-blue-600 font-black text-xs tracking-widest uppercase">AIRZONA ECONOMIC ANALYSIS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
              에어조나(AIRZONA) 수익 계산기
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>안동시 학교급식지원센터 실증시험(비교) 데이터 기반</span>
              </div>
              <span className="hidden md:inline text-slate-200">|</span>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span>듀벨(주) AIRZONA</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner">
                <BarChart3 className="w-8 h-8 text-slate-300" />
             </div>
          </div>
        </div>
      </header>

      <div className="w-full border-t border-slate-200" />

      {/* 2. 컨텐츠 영역 */}
      <main className="bg-[#F8FAFC] pb-24 pt-12 px-4 md:px-0">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* 저장 환경 입력 */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b-2 border-slate-900 pb-3">
              <h2 className="text-2xl font-black flex items-center gap-3 text-slate-900">
                <Calculator className="w-6 h-6 text-blue-600" /> 저장 조건 설정
              </h2>
              <p 
                style={{ color: POINT_COLOR }}
                className="text-[11px] font-black flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-orange-100 shadow-sm"
              >
                <Info className="w-3.5 h-3.5" /> 각 항목의 숫자를 직접 입력하실 수 있습니다. 수정하여 진행하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-slate-900 rounded-2xl shadow-md space-y-3 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
                <label className="text-[13px] font-black text-slate-700 uppercase tracking-tight">품목 선택</label>
                <div className="relative group">
                  <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                    <select 
                      value={selectedItemName}
                      onChange={(e) => setSelectedItemName(e.target.value)}
                      className="w-full bg-transparent font-black text-2xl text-slate-800 outline-none cursor-pointer appearance-none pr-10"
                    >
                      {ITEM_DATA.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white rounded-lg shadow-sm pointer-events-none border border-slate-200">
                      <ChevronDown className="w-6 h-6 text-slate-900" strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white border border-slate-900 rounded-2xl shadow-md space-y-3 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 group">
                <label className="text-[13px] font-black text-slate-700 uppercase tracking-tight flex items-center gap-2">
                  저장 기간 (일)
                </label>
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1 border border-slate-100 group-focus-within:bg-white transition-all">
                  <input 
                    type="text" 
                    inputMode="numeric" 
                    value={storageDays} 
                    onChange={handleInputChange(setStorageDays)}
                    style={{ color: POINT_COLOR }}
                    className="w-full text-3xl font-black bg-transparent border-none focus:ring-0 outline-none" 
                  />
                  <span className="text-lg font-bold text-slate-400">일</span>
                </div>
              </div>

              <div className="p-5 bg-white border border-slate-900 rounded-2xl shadow-md space-y-3 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 group">
                <label className="text-[13px] font-black text-slate-700 uppercase tracking-tight flex items-center gap-2">
                  저장 물량 (kg)
                </label>
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1 border border-slate-100 group-focus-within:bg-white transition-all">
                  <input 
                    type="text" 
                    inputMode="numeric" 
                    value={storageWeight} 
                    onChange={handleInputChange(setStorageWeight)}
                    style={{ color: POINT_COLOR }}
                    className="w-full text-3xl font-black bg-transparent border-none focus:ring-0 outline-none" 
                  />
                  <span className="text-lg font-bold text-slate-400">kg</span>
                </div>
              </div>

              <div className="p-5 bg-white border border-slate-900 rounded-2xl shadow-md space-y-3 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 group">
                <label className="text-[13px] font-black text-slate-700 uppercase tracking-tight flex items-center gap-2">
                  도매 기준가 (원)
                </label>
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1 border border-slate-100 group-focus-within:bg-white transition-all">
                  <input 
                    type="text" 
                    inputMode="numeric" 
                    value={wholesalePrice} 
                    onChange={handleInputChange(setWholesalePrice)}
                    style={{ color: POINT_COLOR }}
                    className="w-full text-3xl font-black bg-transparent border-none focus:ring-0 outline-none" 
                  />
                  <span className="text-lg font-bold text-slate-400 whitespace-nowrap">원</span>
                </div>
              </div>
            </div>
          </section>

          {/* 경제성 비교 분석 */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <h2 className="text-2xl font-black flex items-center gap-3 text-slate-900 tracking-tight">
                <ArrowRightLeft className="w-6 h-6 text-slate-900" /> 경제성 비교 분석
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-[2.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
                <div className="p-6 bg-slate-200 text-slate-700 flex items-center justify-center">
                  <span className="font-black text-xl tracking-tight uppercase">기존저장방법(비설치)</span>
                </div>
                <div className="p-10 space-y-5 flex-grow">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                    <span>저장 총 금액</span>
                    <span className="text-slate-900">₩ {formatNum(calcResults.totalValue)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                    <span>예상 감모율</span>
                    <span className="text-slate-900 font-bold">{formatFloat(calcResults.convertedBaseLoss)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                    <span>감모 및 폐기량</span>
                    <span className="text-slate-900">{formatFloat(calcResults.baseWasteWeight)} kg</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                    <span>손실 추정액</span>
                    <span className="text-red-500 font-black">- ₩ {formatNum(calcResults.baseWasteCost)}</span>
                  </div>
                  <div className="pt-6 border-t-2 border-slate-900">
                    <span className="block text-sm font-black text-slate-500 uppercase mb-2 tracking-widest">실수령 금액 (저장금액-감모금액)</span>
                    <div className="text-4xl font-black text-slate-800 tracking-tighter">₩ {formatNum(calcResults.baseActualValue)}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2.5rem] border-2 border-blue-600 bg-white shadow-2xl shadow-blue-100 overflow-hidden flex flex-col transition-all hover:scale-[1.01]">
                <div className="p-6 bg-blue-600 text-white flex items-center justify-center">
                  <span className="font-black text-xl tracking-tight uppercase">에어조나 사용시</span>
                </div>
                <div className="p-10 space-y-5 flex-grow">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                    <span>저장 총 금액</span>
                    <span className="text-blue-900 font-bold">₩ {formatNum(calcResults.totalValue)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                    <span>예상 감모율</span>
                    <span className="text-blue-600 font-black">{formatFloat(calcResults.convertedAirLoss)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                    <span>감모 및 폐기량</span>
                    <span className="text-blue-600 font-bold">{formatFloat(calcResults.airWasteWeight)} kg</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                    <span>손실 추정액</span>
                    <span className="text-blue-600 font-black">- ₩ {formatNum(calcResults.airWasteCost)}</span>
                  </div>
                  <div className="pt-6 border-t-2 border-blue-600">
                    <span className="block text-sm font-black text-blue-300 uppercase mb-2 tracking-widest text-right">실수령 금액 (저장금액-감모금액)</span>
                    <div className="text-4xl font-black text-blue-600 tracking-tighter text-right">₩ {formatNum(calcResults.airActualValue)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 mt-4 relative overflow-hidden transition-all hover:bg-slate-800">
              <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-transparent pointer-events-none" />
              <div className="text-center md:text-left space-y-1 relative z-10">
                <span className="text-blue-400 font-black text-[11px] tracking-widest uppercase">AIRZONA SAVINGS</span>
                <h3 className="text-2xl font-black tracking-tight leading-tight uppercase">에어조나 설치 후 기대 절감금액 ({storageDays}일 기준)</h3>
              </div>
              <div className="text-center md:text-right relative z-10 flex flex-col items-center md:items-end">
                <div className="text-4xl md:text-5xl font-black tracking-tighter text-blue-400 drop-shadow-md">
                  ₩ {formatNum(calcResults.wasteCostDiff)}
                </div>
              </div>
            </div>
          </section>

          {/* 투자 회수 분석 */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <h2 className="text-2xl font-black flex items-center gap-3 text-slate-900 tracking-tight uppercase">
                <TrendingUp className="w-6 h-6 text-slate-900" /> 투자회수분석(ROI)
              </h2>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-xl overflow-hidden transition-all">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8 md:pr-10 md:border-r border-slate-100 pb-8 md:pb-0">
                  <div className="space-y-2">
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Simulation Input</p>
                    <h3 className="text-lg font-bold text-slate-700">투자 효율 시뮬레이션</h3>
                    <div className="w-full h-px bg-slate-200 my-4" />
                  </div>
                  
                  <div className="space-y-8">
                    <div className="space-y-4 transition-all group">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest">에어조나 기기 및 설치 비용</label>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2 border border-slate-200 group-focus-within:border-blue-600 group-focus-within:bg-white transition-all shadow-sm">
                         <span className="text-xl font-bold text-slate-400 group-focus-within:text-blue-600 transition-colors">₩</span>
                         <input 
                            type="text" 
                            value={installCost} 
                            onChange={handleInstallCostChange}
                            placeholder="0"
                            className="w-full bg-transparent text-2xl font-black outline-none tabular-nums text-slate-800" 
                         />
                      </div>
                      <p className="text-[11px] text-slate-400 font-bold ml-4 -mt-2 mb-1">
                        (설치 여건에 따라 설치 비용은 증가할 수 있습니다)
                      </p>
                    </div>

                    <div className="space-y-4 transition-all group">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest">연간 예상 저장 횟수</label>
                      </div>
                      <div className="flex items-center gap-4 bg-slate-50 rounded-xl px-4 py-2 border border-slate-200 group-focus-within:border-blue-600 group-focus-within:bg-white transition-all shadow-sm">
                         <input 
                            type="text" 
                            inputMode="numeric" 
                            value={annualCycles} 
                            onChange={handleInputChange(setAnnualCycles)}
                            style={{ color: POINT_COLOR }}
                            className="w-full bg-transparent text-2xl font-black outline-none tabular-nums" 
                         />
                         <span className="text-xl font-bold text-slate-300 whitespace-nowrap group-focus-within:text-blue-600 transition-colors">회 / 년</span>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 shadow-inner mt-4">
                        <div className="text-xs font-bold leading-relaxed flex items-start gap-2" style={{ color: POINT_COLOR }}>
                          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <div>
                            <p>에어조나 기기 및 설치비용과 연간 예상 저장횟수를 직접 입력해보세요.</p>
                            <p className="opacity-80">기대수익 결과가 실시간으로 계산됩니다.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-6 justify-center">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Analysis Results</p>
                    <h3 className="text-lg font-bold text-slate-700">기대수익 분석 결과</h3>
                    <div className="w-full h-px bg-slate-100 my-4" />
                  </div>

                  <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-2 group transition-all hover:bg-white hover:shadow-md shadow-sm">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">연간 총 기대 절감액</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 tabular-nums">
                        ₩ {formatNum(calcResults.expectedAnnualSaving)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-600 rounded-3xl p-8 shadow-lg relative overflow-hidden group transition-all hover:scale-[1.02]">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <TrendingUp className="w-24 h-24 text-white" />
                    </div>
                    <div className="relative z-10 space-y-2">
                      <p className="text-xs font-black text-blue-100 uppercase tracking-[0.2em]">Payback Period</p>
                      <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-tighter">투자비용 회수기간</h4>
                      <div className="flex items-baseline gap-3">
                        <span className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none tabular-nums drop-shadow-md">
                          {roiInfo.value}
                        </span>
                        <span className="text-xl md:text-2xl font-black text-blue-200">{roiInfo.unit} 이내</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.min(100, (calcResults.reductionRate / 40) * 100)}%` }} 
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">절감율: {formatFloat(calcResults.reductionRate)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-white pt-12 pb-12 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 text-[10px] text-slate-400 flex flex-col md:flex-row justify-between items-center gap-6 font-bold uppercase tracking-[0.3em]">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-2">
            <p>AIRZONA SIMULATION ENGINE V.1.0</p>
          </div>
          <p className="text-slate-900 font-black tracking-widest">© 2026 AIRZONA | DEWBELL CO.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
