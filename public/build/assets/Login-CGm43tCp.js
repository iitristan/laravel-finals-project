import{u as i,j as e}from"./app-CZLYLr54.js";function m(){const{data:l,setData:a,post:o,processing:r,errors:t}=i({email:"",password:""}),n=s=>{s.preventDefault(),o("/login")};return e.jsx("div",{className:"min-h-screen bg-gray-100 flex items-center justify-center",children:e.jsxs("div",{className:"bg-white p-8 rounded-lg shadow-md w-96",children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-800 mb-6",children:"Login"}),e.jsxs("form",{onSubmit:n,children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"block text-gray-700 text-sm font-bold mb-2",htmlFor:"email",children:"Email"}),e.jsx("input",{type:"email",id:"email",className:"w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500",value:l.email,onChange:s=>a("email",s.target.value)}),t.email&&e.jsx("div",{className:"text-red-500 text-sm mt-1",children:t.email})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{className:"block text-gray-700 text-sm font-bold mb-2",htmlFor:"password",children:"Password"}),e.jsx("input",{type:"password",id:"password",className:"w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500",value:l.password,onChange:s=>a("password",s.target.value)}),t.password&&e.jsx("div",{className:"text-red-500 text-sm mt-1",children:t.password})]}),e.jsx("button",{type:"submit",className:"w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none",disabled:r,children:r?"Logging in...":"Login"})]}),e.jsx("div",{className:"mt-4 text-center",children:e.jsx("a",{href:"/register",className:"text-blue-500 hover:text-blue-600",children:"Don't have an account? Register"})})]})})}export{m as default};