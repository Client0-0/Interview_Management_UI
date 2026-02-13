
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setItem=(key:string,value:any)=>{
  
  localStorage.setItem(key,JSON.stringify(value));
}

export const getItem=(key:string)=>{
 const value = localStorage.getItem(key);

  if (!value || value === "undefined") return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
    //return JSON.parse(localStorage.getItem(key)||"D");

}

export const reomveItem=(key:string)=>{
   localStorage.removeItem(key);
}
 
export const clearItem=()=>{
   localStorage.clear();
}
