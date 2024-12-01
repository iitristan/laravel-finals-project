import{u as d,j as e}from"./app-CZLYLr54.js";function m(){const{data:t,setData:l,post:o,processing:r,errors:a}=d({name:"",email:"",password:"",password_confirmation:""}),n=s=>{s.preventDefault(),o("/register")};return e.jsx("div",{className:"min-h-screen bg-gray-100 flex items-center justify-center",children:e.jsxs("div",{className:"bg-white p-8 rounded-lg shadow-md w-96",children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-800 mb-6",children:"Register"}),e.jsxs("form",{onSubmit:n,children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"block text-gray-700 text-sm font-bold mb-2",htmlFor:"name",children:"Name"}),e.jsx("input",{type:"text",id:"name",className:"w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500",value:t.name,onChange:s=>l("name",s.target.value)}),a.name&&e.jsx("div",{className:"text-red-500 text-sm mt-1",children:a.name})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"block text-gray-700 text-sm font-bold mb-2",htmlFor:"email",children:"Email"}),e.jsx("input",{type:"email",id:"email",className:"w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500",value:t.email,onChange:s=>l("email",s.target.value)}),a.email&&e.jsx("div",{className:"text-red-500 text-sm mt-1",children:a.email})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"block text-gray-700 text-sm font-bold mb-2",htmlFor:"password",children:"Password"}),e.jsx("input",{type:"password",id:"password",className:"w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500",value:t.password,onChange:s=>l("password",s.target.value)}),a.password&&e.jsx("div",{className:"text-red-500 text-sm mt-1",children:a.password})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{className:"block text-gray-700 text-sm font-bold mb-2",htmlFor:"password_confirmation",children:"Confirm Password"}),e.jsx("input",{type:"password",id:"password_confirmation",className:"w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500",value:t.password_confirmation,onChange:s=>l("password_confirmation",s.target.value)})]}),e.jsx("button",{type:"submit",className:"w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none",disabled:r,children:r?"Registering...":"Register"})]}),e.jsx("div",{className:"mt-4 text-center",children:e.jsx("a",{href:"/login",className:"text-blue-500 hover:text-blue-600",children:"Already have an account? Login"})})]})})}export{m as default};