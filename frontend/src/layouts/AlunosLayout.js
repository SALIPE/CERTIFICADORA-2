import { Outlet } from "react-router-dom";



export default function AlunosLayout() {


  return (
    <div className="main-panel">
      <div className="sticky-top">
        Cabeçalho Alunos
      </div>
      <div className="content">
        <Outlet />
      </div>
      footer
    </div>
  );
}

