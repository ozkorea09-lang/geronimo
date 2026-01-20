import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-brand-latte text-brand-text">
      {/* Header */}
      <div className="bg-brand-coffee py-16 mb-12 shadow-wood relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="font-serif text-4xl md:text-5xl text-brand-gold mb-4 drop-shadow-md">Terms of Service</h1>
          <p className="text-brand-cream text-lg font-light tracking-wide">이용약관</p>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-24 max-w-4xl">
        <div className="bg-brand-cream p-10 md:p-14 rounded-xl shadow-wood border border-brand-wood/20">
          <div className="prose prose-lg max-w-none text-brand-coffee font-medium leading-relaxed">
            <p className="mb-8">
              본 약관은 제로니모 커피하우스(이하 "회사")가 제공하는 웹사이트 및 제반 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>

            <h3 className="font-serif text-2xl text-brand-text mt-8 mb-4 font-bold border-l-4 border-brand-gold pl-4">제1조 (목적)</h3>
            <p>
              이 약관은 회사가 운영하는 웹사이트에서 제공하는 인터넷 관련 서비스를 이용함에 있어 사이버 몰과 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>

            <h3 className="font-serif text-2xl text-brand-text mt-12 mb-4 font-bold border-l-4 border-brand-gold pl-4">제2조 (용어의 정의)</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2 text-brand-muted">
              <li>"사이트"란 회사가 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말합니다.</li>
              <li>"이용자"란 사이트에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
              <li>"회원"이라 함은 사이트에 개인정보를 제공하여 회원등록을 한 자로서, 사이트의 정보를 지속적으로 제공받으며, 사이트가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
            </ul>

            <h3 className="font-serif text-2xl text-brand-text mt-12 mb-4 font-bold border-l-4 border-brand-gold pl-4">제3조 (약관의 명시와 개정)</h3>
            <p>
              회사는 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소, 전화번호, 전자우편주소 등을 이용자가 쉽게 알 수 있도록 사이트의 초기 서비스화면에 게시합니다. 다만, 약관의 내용은 이용자가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.
            </p>

            <h3 className="font-serif text-2xl text-brand-text mt-12 mb-4 font-bold border-l-4 border-brand-gold pl-4">제4조 (서비스의 제공 및 변경)</h3>
            <p>
              회사는 다음과 같은 업무를 수행합니다.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2 text-brand-muted">
              <li>재화 또는 용역에 대한 정보 제공 및 구매 계약의 체결</li>
              <li>구매 계약이 체결된 재화 또는 용역의 배송</li>
              <li>기타 회사가 정하는 업무</li>
            </ul>

            <h3 className="font-serif text-2xl text-brand-text mt-12 mb-4 font-bold border-l-4 border-brand-gold pl-4">제5조 (저작권의 귀속 및 이용제한)</h3>
            <p>
              회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다. 이용자는 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
            </p>

            <h3 className="font-serif text-2xl text-brand-text mt-12 mb-4 font-bold border-l-4 border-brand-gold pl-4">제6조 (분쟁해결)</h3>
            <p>
              회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치, 운영합니다. 회사는 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다.
            </p>

            <div className="bg-brand-wood/10 p-6 rounded-lg mt-12 border-t-2 border-brand-coffee">
              <p className="text-sm text-brand-muted text-center">
                본 약관은 2026년 1월 1일부터 시행됩니다.<br/>
                제로니모 커피하우스 | 경기도 양주시 화합로 1597번길 3
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;