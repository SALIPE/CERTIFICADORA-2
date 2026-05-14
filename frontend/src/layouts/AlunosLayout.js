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
      <footer style={{ background: "#06164d" }} className="text-light text-center py-3 mt-auto">
      </footer>
    </div>
  );
}

