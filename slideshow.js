
const keyAllowLeft  = 37;
const keyAllowRight = 39;
let flipInputs;

class DocumentUrlParameterListener{
    get url(){ return new URL(document.location); }
    constructor(name, onGet = it=> it, judgeInvalid = it=> false){
        this.name = name;
        this.onGet = onGet;
        this.judgeInvalid = judgeInvalid;
        this.listeners = [];
        this.listeners["set"] = [];
    }
    get value(){ return this.onGet(this.url.searchParams.get(this.name)); }
    set value(value){
        if(this.judgeInvalid(value)) return;
        const before = this.value;
        const url = this.url;
        url.searchParams.set(this.name, value);
        history.replaceState('','', url.href);
        if("set" in this.listeners)
            this.listeners["set"].forEach(it=> it(value, before, url));
    }
    reload(){ this.value = this.value; }
    addOnSet(func){ this.listeners["set"].push(func); }
    removeOnSet(func){
        this.listeners["set"]
            .filter(it=> it === func)
            .forEach((it, index)=> this.listeners["set"].splice(index, 1));
    }
    clean(){
        const url = this.url;
        url.searchParams.delete(this.name);
        history.replaceState('','', url.href);
    }
}

class Increment {
    constructor(element){
        this.element = element;
    }
}
class Page {
    constructor(element){
        this.element = element;
        this.increments
            = Array.from(element.getElementsByClassName("inc"))
                .map(it=> new Increment(it));
        const counter
            = new DocumentUrlParameterListener(
                "inc"
            ,it=> {
                if(it == null) return 0;
                return Number(it);
            },it=> {
                return it < 0
                    || it >= this.increments.length + 1;
            });
        counter.addOnSet( (current, before)=>{
            if(before > current)
                this.increments[before - 1].element.style.visibility = "hidden";
            if(current != 0)
                this.increments[current - 1].element.style.visibility = "visible";
        });
        this.counter = counter;
        this.hidden();
        counter.reload();
        console.log(this.increments);
    }
    increment() {
        const before = this.counter.value;
        this.counter.value = this.counter.value + 1;
        return before != this.counter.value;
    }
    decrement() {
        const before = this.counter.value;
        this.counter.value = this.counter.value - 1;
        return before != this.counter.value;
    }
    hidden() {
        this.increments
            .forEach(it=> it.element.style.visibility = "hidden");
        this.counter.value = 0;
    }
    visible() {
        this.increments
            .forEach(it=> it.element.style.visibility = "visible");
        this.counter.value = this.increments.length;
    }
}
class Slideshow {
    constructor(element){
        this.element = element;
        this.pages
            = Array.from(element.getElementsByClassName('pages')[0].children)
                .filter(it=> it.tagName == 'SECTION')
                .map(it=> new Page(it));
        const counter
            = new DocumentUrlParameterListener(
                "page"
            ,it=> {
                if(it == null) return 0;
                return Number(it);
            },it=> {
                return it < 0
                    || it >= this.pages.length;
            });
        counter.addOnSet( (current, before)=>{
            this.pages[before].element.style.visibility = "hidden";
            this.pages[current].element.style.visibility = "visible";
        });
        counter.reload();
        this.counter = counter;
        console.log(this.pages);
    }
    increment() {
        const before = this.counter.value;
        const inPageIncremented = this.pages[before].increment();
        if(!inPageIncremented)
            this.counter.value = this.counter.value + 1;
        if(before != this.counter.value)
            this.pages[before].hidden();
    }
    decrement() {
        const before = this.counter.value;
        const inPageDecremented = this.pages[before].decrement();
        if(!inPageDecremented)
            this.counter.value = this.counter.value - 1;
        if(before != this.counter.value){
            this.pages[before].hidden();
            this.pages[this.counter.value].visible();
        }
    }
}
window.onload = function(){
    const slideshow = new Slideshow(document.getElementsByClassName('slideshow')[0]);
    slideshow.element.addEventListener("click", e=>{
        const clientWidth = slideshow.element.clientWidth
        const border = clientWidth * 0.1;
        const x = e.offsetX;
        if(border > x)
            slideshow.decrement();
        if(border > clientWidth - x)
            slideshow.increment();
    });

    document.onkeydown = function(event){
        switch(event.keyCode){
            case keyAllowLeft : slideshow.decrement(); break;
            case keyAllowRight: slideshow.increment(); break;
        }
    };
}
