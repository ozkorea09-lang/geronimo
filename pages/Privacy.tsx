import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-brand-latte text-brand-text">
      {/* Header */}
      <div className="bg-brand-coffee py-16 mb-12 shadow-wood relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="font-serif text-4xl md:text-5xl text-brand-gold mb-4 drop-shadow-md">Privacy Policy</h1>
          <p className="text-brand-cream text-lg font-light tracking-wide">개인정보처리방침</p>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-24 max-w-4xl">
        <div className="bg-brand-cream p-10 md:p-14 rounded-xl shadow-wood border border-brand-wood/20">
          <div className="prose prose-lg max-w-none text-brand-coffee font-medium leading-relaxed">
            <p className="mb-8">
              제로니모 커피하우스('이하 회사')는 고객님의 개인정보를 중요시하며, "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수하고 있습니다.
              회사는 개인정보처리방침을 통하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
            </p>

            <h3 className="font-serif text-2xl text-brand-text mt-8 mb-4 font-bold border-l-4 border-brand-gold pl-4">1. 수집하는 개인정보 항목</h3>
            <p>
              회사는 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2 text-brand-muted">
              <li>수집항목: 이름, 이메일, 전화번호, 접속 로그, 쿠키, 접속 IP 정보</li>
              <li>개인정보 수집방법: 홈페이지(문의사항, 이벤트 응모), 전화/팩스를 통한 회원가입</li>
            </ul>

            <h3 className="font-serif text-2xl text-brand-text mt-12 mb-4 font-bold border-l-4 border-brand-gold pl-4">2. 개인정보의 수집 및 이용목적</h3>
            <p>
              회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2 text-brand-muted">
              <li>서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 콘텐츠 제공</li>
              <li>고객 관리: 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지</li>
              <li>마케팅 및 광고에 활용: 신규 서비스(제품) 개발 및 특화, 이벤트 등 광고성 정보 전달</li>
            </ul>

            <h3 className="font-serif text-2xl text-brand-text mt-12 mb-4 font-bold border-l-4 border-brand-gold pl-4">3. 개인정보의 보유 및 이용기간</h3>
            <p>
              원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2 text-brand-muted">
              <li>보존 항목: 이름, 이메일, 전화번호</li>
              <li>보존 근거: 전자상거래등에서의 소비자보호에 관한 법률</li>
              <li>보존 기간: 3년 (소비자의 불만 또는 분쟁처리에 관한 기록)</li>
            </ul>

            <h3 className="font-serif text-2xl text-brand-text mt-12 mb-4 font-bold border-l-4 border-brand-gold pl-4">4. 개인정보의 파기절차 및 방법</h3>
            <p>
              회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다. 파기절차 및 방법은 다음과 같습니다.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2 text-brand-muted">
              <li>파기절차: 고객님이 회원가입 등을 위해 입력하신 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기되어집니다.</li>
              <li>파기방법: 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</li>
            </ul>

            <h3 className="font-serif text-2xl text-brand-text mt-12 mb-4 font-bold border-l-4 border-brand-gold pl-4">5. 개인정보 관련 문의</h3>
            <p>
              개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.
            </p>
            <div className="bg-brand-wood/10 p-6 rounded-lg mt-4">
              <p className="font-bold text-brand-coffee">제로니모 커피하우스 고객센터</p>
              <p className="text-brand-muted mt-2">이메일: geronimo2291@naver.com</p>
              <p className="text-brand-muted">전화번호: 031-858-3434</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;