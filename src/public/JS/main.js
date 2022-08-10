const button= document.querySelectorAll('.btnh');





button.forEach(item=>{
    item.addEventListener('click',(e)=>{
        console.log(item.classList.contains('btn-success'));
        if(item.classList.contains('btn-danger')){
            item.classList.replace('btn-danger','btn-success');
        }else{
            item.classList.replace('btn-success','btn-danger');
            
        }

    })
})
