export function BankLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7v3h20V7L12 2z" fill="#00387a" stroke="#00387a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 10v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8" stroke="#00387a" strokeWidth="1.5"/>
          <path d="M5 10v8M9 10v8M15 10v8M19 10v8" stroke="#00387a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M2 20h20" stroke="#00387a" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="text-white text-xl">은행K</div>
    </div>
  );
}
