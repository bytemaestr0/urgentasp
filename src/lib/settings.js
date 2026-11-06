export const PAGES = [["home","Acasă"],["instructiuni","Instrucțiuni"],["programare","Programare"],["cont","Cont"]];

export const DEF = { name:"", email:"", plan:"free", link:"", ntfy:"", freeMode:"new", auto:false, excluded:[] };

export const load = () => {
  try { return { ...DEF, ...JSON.parse(localStorage.getItem("urgentasp") || "{}") }; }
  catch (e) { return DEF; }
};
