(function(){"use strict";function Xc(d){return d&&d.__esModule&&Object.prototype.hasOwnProperty.call(d,"default")?d.default:d}var lr={exports:{}},Mi={};var Zc;function Gp(){if(Zc)return Mi;Zc=1;var d=Symbol.for("react.transitional.element"),g=Symbol.for("react.fragment");function E(c,b,M){var _=null;if(M!==void 0&&(_=""+M),b.key!==void 0&&(_=""+b.key),"key"in b){M={};for(var A in b)A!=="key"&&(M[A]=b[A])}else M=b;return b=M.ref,{$$typeof:d,type:c,key:_,ref:b!==void 0?b:null,props:M}}return Mi.Fragment=g,Mi.jsx=E,Mi.jsxs=E,Mi}var Qc;function Vp(){return Qc||(Qc=1,lr.exports=Gp()),lr.exports}var r=Vp(),or={exports:{}},ae={};var Kc;function Yp(){if(Kc)return ae;Kc=1;var d=Symbol.for("react.transitional.element"),g=Symbol.for("react.portal"),E=Symbol.for("react.fragment"),c=Symbol.for("react.strict_mode"),b=Symbol.for("react.profiler"),M=Symbol.for("react.consumer"),_=Symbol.for("react.context"),A=Symbol.for("react.forward_ref"),L=Symbol.for("react.suspense"),S=Symbol.for("react.memo"),N=Symbol.for("react.lazy"),y=Symbol.for("react.activity"),Z=Symbol.for("react.view_transition"),ce=Symbol.iterator;function ue(m){return m===null||typeof m!="object"?null:(m=ce&&m[ce]||m["@@iterator"],typeof m=="function"?m:null)}var X={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Q=Object.assign,ge={};function O(m,z,R){this.props=m,this.context=z,this.refs=ge,this.updater=R||X}O.prototype.isReactComponent={},O.prototype.setState=function(m,z){if(typeof m!="object"&&typeof m!="function"&&m!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,m,z,"setState")},O.prototype.forceUpdate=function(m){this.updater.enqueueForceUpdate(this,m,"forceUpdate")};function Se(){}Se.prototype=O.prototype;function me(m,z,R){this.props=m,this.context=z,this.refs=ge,this.updater=R||X}var ye=me.prototype=new Se;ye.constructor=me,Q(ye,O.prototype),ye.isPureReactComponent=!0;var Ne=Array.isArray;function Y(){}var ee={H:null,A:null,T:null,S:null},J=Object.prototype.hasOwnProperty;function Ee(m,z,R){var q=R.ref;return{$$typeof:d,type:m,key:z,ref:q!==void 0?q:null,props:R}}function Me(m,z){return Ee(m.type,z,m.props)}function H(m){return typeof m=="object"&&m!==null&&m.$$typeof===d}function ie(m){var z={"=":"=0",":":"=2"};return"$"+m.replace(/[=:]/g,function(R){return z[R]})}var je=/\/+/g;function de(m,z){return typeof m=="object"&&m!==null&&m.key!=null?ie(""+m.key):z.toString(36)}function j(m){switch(m.status){case"fulfilled":return m.value;case"rejected":throw m.reason;default:switch(typeof m.status=="string"?m.then(Y,Y):(m.status="pending",m.then(function(z){m.status==="pending"&&(m.status="fulfilled",m.value=z)},function(z){m.status==="pending"&&(m.status="rejected",m.reason=z)})),m.status){case"fulfilled":return m.value;case"rejected":throw m.reason}}throw m}function $(m,z,R,q,te){var oe=typeof m;(oe==="undefined"||oe==="boolean")&&(m=null);var U=!1;if(m===null)U=!0;else switch(oe){case"bigint":case"string":case"number":U=!0;break;case"object":switch(m.$$typeof){case d:case g:U=!0;break;case N:return U=m._init,$(U(m._payload),z,R,q,te)}}if(U)return te=te(m),U=q===""?"."+de(m,0):q,Ne(te)?(R="",U!=null&&(R=U.replace(je,"$&/")+"/"),$(te,z,R,"",function(Kn){return Kn})):te!=null&&(H(te)&&(te=Me(te,R+(te.key==null||m&&m.key===te.key?"":(""+te.key).replace(je,"$&/")+"/")+U)),z.push(te)),1;U=0;var D=q===""?".":q+":";if(Ne(m))for(var P=0;P<m.length;P++)q=m[P],oe=D+de(q,P),U+=$(q,z,R,oe,te);else if(P=ue(m),typeof P=="function")for(m=P.call(m),P=0;!(q=m.next()).done;)q=q.value,oe=D+de(q,P++),U+=$(q,z,R,oe,te);else if(oe==="object"){if(typeof m.then=="function")return $(j(m),z,R,q,te);throw z=String(m),Error("Objects are not valid as a React child (found: "+(z==="[object Object]"?"object with keys {"+Object.keys(m).join(", ")+"}":z)+"). If you meant to render a collection of children, use an array instead.")}return U}function F(m,z,R){if(m==null)return m;var q=[],te=0;return $(m,q,"","",function(oe){return z.call(R,oe,te++)}),q}function he(m){if(m._status===-1){var z=m._result,R=z();R.then(function(q){(m._status===0||m._status===-1)&&(m._status=1,m._result=q,R.status===void 0&&(R.status="fulfilled",R.value=q))},function(q){(m._status===0||m._status===-1)&&(m._status=2,m._result=q,R.status===void 0&&(R.status="rejected",R.reason=q))}),m._status===-1&&(m._status=0,m._result=R)}if(m._status===1)return m._result.default;throw m._result}var pe=typeof reportError=="function"?reportError:function(m){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var z=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof m=="object"&&m!==null&&typeof m.message=="string"?String(m.message):String(m),error:m});if(!window.dispatchEvent(z))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",m);return}console.error(m)};function Ge(m){var z=ee.T,R={};R.types=z!==null?z.types:null,ee.T=R;try{var q=m(),te=ee.S;te!==null&&te(R,q),typeof q=="object"&&q!==null&&typeof q.then=="function"&&q.then(Y,pe)}catch(oe){pe(oe)}finally{z!==null&&R.types!==null&&(z.types=R.types),ee.T=z}}function Fe(m){var z=ee.T;if(z!==null){var R=z.types;R===null?z.types=[m]:R.indexOf(m)===-1&&R.push(m)}else Ge(Fe.bind(null,m))}var Tn={map:F,forEach:function(m,z,R){F(m,function(){z.apply(this,arguments)},R)},count:function(m){var z=0;return F(m,function(){z++}),z},toArray:function(m){return F(m,function(z){return z})||[]},only:function(m){if(!H(m))throw Error("React.Children.only expected to receive a single React element child.");return m}};return ae.Activity=y,ae.Children=Tn,ae.Component=O,ae.Fragment=E,ae.Profiler=b,ae.PureComponent=me,ae.StrictMode=c,ae.Suspense=L,ae.ViewTransition=Z,ae.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=ee,ae.__COMPILER_RUNTIME={__proto__:null,c:function(m){return ee.H.useMemoCache(m)}},ae.addTransitionType=Fe,ae.cache=function(m){return function(){return m.apply(null,arguments)}},ae.cacheSignal=function(){return null},ae.cloneElement=function(m,z,R){if(m==null)throw Error("The argument must be a React element, but you passed "+m+".");var q=Q({},m.props),te=m.key;if(z!=null)for(oe in z.key!==void 0&&(te=""+z.key),z)!J.call(z,oe)||oe==="key"||oe==="__self"||oe==="__source"||oe==="ref"&&z.ref===void 0||(q[oe]=z[oe]);var oe=arguments.length-2;if(oe===1)q.children=R;else if(1<oe){for(var U=Array(oe),D=0;D<oe;D++)U[D]=arguments[D+2];q.children=U}return Ee(m.type,te,q)},ae.createContext=function(m){return m={$$typeof:_,_currentValue:m,_currentValue2:m,_threadCount:0,Provider:null,Consumer:null},m.Provider=m,m.Consumer={$$typeof:M,_context:m},m},ae.createElement=function(m,z,R){var q,te={},oe=null;if(z!=null)for(q in z.key!==void 0&&(oe=""+z.key),z)J.call(z,q)&&q!=="key"&&q!=="__self"&&q!=="__source"&&(te[q]=z[q]);var U=arguments.length-2;if(U===1)te.children=R;else if(1<U){for(var D=Array(U),P=0;P<U;P++)D[P]=arguments[P+2];te.children=D}if(m&&m.defaultProps)for(q in U=m.defaultProps,U)te[q]===void 0&&(te[q]=U[q]);return Ee(m,oe,te)},ae.createRef=function(){return{current:null}},ae.forwardRef=function(m){return{$$typeof:A,render:m}},ae.isValidElement=H,ae.lazy=function(m){return{$$typeof:N,_payload:{_status:-1,_result:m},_init:he}},ae.memo=function(m,z){return{$$typeof:S,type:m,compare:z===void 0?null:z}},ae.startTransition=Ge,ae.unstable_useCacheRefresh=function(){return ee.H.useCacheRefresh()},ae.use=function(m){return ee.H.use(m)},ae.useActionState=function(m,z,R){return ee.H.useActionState(m,z,R)},ae.useCallback=function(m,z){return ee.H.useCallback(m,z)},ae.useContext=function(m){return ee.H.useContext(m)},ae.useDebugValue=function(){},ae.useDeferredValue=function(m,z){return ee.H.useDeferredValue(m,z)},ae.useEffect=function(m,z){return ee.H.useEffect(m,z)},ae.useEffectEvent=function(m){return ee.H.useEffectEvent(m)},ae.useId=function(){return ee.H.useId()},ae.useImperativeHandle=function(m,z,R){return ee.H.useImperativeHandle(m,z,R)},ae.useInsertionEffect=function(m,z){return ee.H.useInsertionEffect(m,z)},ae.useLayoutEffect=function(m,z){return ee.H.useLayoutEffect(m,z)},ae.useMemo=function(m,z){return ee.H.useMemo(m,z)},ae.useOptimistic=function(m,z){return ee.H.useOptimistic(m,z)},ae.useReducer=function(m,z,R){return ee.H.useReducer(m,z,R)},ae.useRef=function(m){return ee.H.useRef(m)},ae.useState=function(m){return ee.H.useState(m)},ae.useSyncExternalStore=function(m,z,R){return ee.H.useSyncExternalStore(m,z,R)},ae.useTransition=function(){return ee.H.useTransition()},ae.version="19.3.1",ae}var Jc;function rr(){return Jc||(Jc=1,or.exports=Yp()),or.exports}var B=rr();const Xp=Xc(B);var sr={exports:{}},Ci={},cr={exports:{}},ur={};var $c;function Zp(){return $c||($c=1,(function(d){function g(j,$){var F=j.length;j.push($);e:for(;0<F;){var he=F-1>>>1,pe=j[he];if(0<b(pe,$))j[he]=$,j[F]=pe,F=he;else break e}}function E(j){return j.length===0?null:j[0]}function c(j){if(j.length===0)return null;var $=j[0],F=j.pop();if(F!==$){j[0]=F;e:for(var he=0,pe=j.length,Ge=pe>>>1;he<Ge;){var Fe=2*(he+1)-1,Tn=j[Fe],m=Fe+1,z=j[m];if(0>b(Tn,F))m<pe&&0>b(z,Tn)?(j[he]=z,j[m]=F,he=m):(j[he]=Tn,j[Fe]=F,he=Fe);else if(m<pe&&0>b(z,F))j[he]=z,j[m]=F,he=m;else break e}}return $}function b(j,$){var F=j.sortIndex-$.sortIndex;return F!==0?F:j.id-$.id}if(d.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var M=performance;d.unstable_now=function(){return M.now()}}else{var _=Date,A=_.now();d.unstable_now=function(){return _.now()-A}}var L=[],S=[],N=1,y=null,Z=3,ce=!1,ue=!1,X=!1,Q=!1,ge=typeof setTimeout=="function"?setTimeout:null,O=typeof clearTimeout=="function"?clearTimeout:null,Se=typeof setImmediate<"u"?setImmediate:null;function me(j){for(var $=E(S);$!==null;){if($.callback===null)c(S);else if($.startTime<=j)c(S),$.sortIndex=$.expirationTime,g(L,$);else break;$=E(S)}}function ye(j){if(X=!1,me(j),!ue)if(E(L)!==null)ue=!0,Ne||(Ne=!0,H());else{var $=E(S);$!==null&&de(ye,$.startTime-j)}}var Ne=!1,Y=-1,ee=5,J=-1;function Ee(){return Q?!0:!(d.unstable_now()-J<ee)}function Me(){if(Q=!1,Ne){var j=d.unstable_now();J=j;var $=!0;try{e:{ue=!1,X&&(X=!1,O(Y),Y=-1),ce=!0;var F=Z;try{n:{for(me(j),y=E(L);y!==null&&!(y.expirationTime>j&&Ee());){var he=y.callback;if(typeof he=="function"){y.callback=null,Z=y.priorityLevel;var pe=he(y.expirationTime<=j);if(j=d.unstable_now(),typeof pe=="function"){y.callback=pe,me(j),$=!0;break n}y===E(L)&&c(L),me(j)}else c(L);y=E(L)}if(y!==null)$=!0;else{var Ge=E(S);Ge!==null&&de(ye,Ge.startTime-j),$=!1}}break e}finally{y=null,Z=F,ce=!1}$=void 0}}finally{$?H():Ne=!1}}}var H;if(typeof Se=="function")H=function(){Se(Me)};else if(typeof MessageChannel<"u"){var ie=new MessageChannel,je=ie.port2;ie.port1.onmessage=Me,H=function(){je.postMessage(null)}}else H=function(){ge(Me,0)};function de(j,$){Y=ge(function(){j(d.unstable_now())},$)}d.unstable_IdlePriority=5,d.unstable_ImmediatePriority=1,d.unstable_LowPriority=4,d.unstable_NormalPriority=3,d.unstable_Profiling=null,d.unstable_UserBlockingPriority=2,d.unstable_cancelCallback=function(j){j.callback=null},d.unstable_forceFrameRate=function(j){0>j||125<j?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ee=0<j?Math.floor(1e3/j):5},d.unstable_getCurrentPriorityLevel=function(){return Z},d.unstable_next=function(j){switch(Z){case 1:case 2:case 3:var $=3;break;default:$=Z}var F=Z;Z=$;try{return j()}finally{Z=F}},d.unstable_requestPaint=function(){Q=!0},d.unstable_runWithPriority=function(j,$){switch(j){case 1:case 2:case 3:case 4:case 5:break;default:j=3}var F=Z;Z=j;try{return $()}finally{Z=F}},d.unstable_scheduleCallback=function(j,$,F){var he=d.unstable_now();switch(typeof F=="object"&&F!==null?(F=F.delay,F=typeof F=="number"&&0<F?he+F:he):F=he,j){case 1:var pe=-1;break;case 2:pe=250;break;case 5:pe=1073741823;break;case 4:pe=1e4;break;default:pe=5e3}return pe=F+pe,j={id:N++,callback:$,priorityLevel:j,startTime:F,expirationTime:pe,sortIndex:-1},F>he?(j.sortIndex=F,g(S,j),E(L)===null&&j===E(S)&&(X?(O(Y),Y=-1):X=!0,de(ye,F-he))):(j.sortIndex=pe,g(L,j),ue||ce||(ue=!0,Ne||(Ne=!0,H()))),j},d.unstable_shouldYield=Ee,d.unstable_wrapCallback=function(j){var $=Z;return function(){var F=Z;Z=$;try{return j.apply(this,arguments)}finally{Z=F}}}})(ur)),ur}var Wc;function Qp(){return Wc||(Wc=1,cr.exports=Zp()),cr.exports}var dr={exports:{}},on={};var Fc;function Kp(){if(Fc)return on;Fc=1;var d=rr();function g(N){var y="https://react.dev/errors/"+N;if(1<arguments.length){y+="?args[]="+encodeURIComponent(arguments[1]);for(var Z=2;Z<arguments.length;Z++)y+="&args[]="+encodeURIComponent(arguments[Z])}return"Minified React error #"+N+"; visit "+y+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function E(){}var c={d:{f:E,r:function(){throw Error(g(522))},D:E,C:E,L:E,m:E,X:E,S:E,M:E},p:0,findDOMNode:null},b=Symbol.for("react.portal"),M=Symbol.for("react.recoverable"),_=Symbol.for("react.optimistic_key");function A(N,y,Z){var ce=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:b,key:ce==null?null:ce===_?_:""+ce,children:N,containerInfo:y,implementation:Z}}var L=d.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function S(N,y){if(N==="font")return"";if(typeof y=="string")return y==="use-credentials"?y:""}return on.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=c,on.browser=function(N){return{$$typeof:M,_reason:N}},on.createPortal=function(N,y){var Z=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!y||y.nodeType!==1&&y.nodeType!==9&&y.nodeType!==11)throw Error(g(299));return A(N,y,null,Z)},on.flushSync=function(N){var y=L.T,Z=c.p;try{if(L.T=null,c.p=2,N)return N()}finally{L.T=y,c.p=Z,c.d.f()}},on.preconnect=function(N,y){typeof N=="string"&&(y?(y=y.crossOrigin,y=typeof y=="string"?y==="use-credentials"?y:"":void 0):y=null,c.d.C(N,y))},on.prefetchDNS=function(N){typeof N=="string"&&c.d.D(N)},on.preinit=function(N,y){if(typeof N=="string"&&y&&typeof y.as=="string"){var Z=y.as,ce=S(Z,y.crossOrigin),ue=typeof y.integrity=="string"?y.integrity:void 0,X=typeof y.fetchPriority=="string"?y.fetchPriority:void 0;Z==="style"?c.d.S(N,typeof y.precedence=="string"?y.precedence:void 0,{crossOrigin:ce,integrity:ue,fetchPriority:X}):Z==="script"&&c.d.X(N,{crossOrigin:ce,integrity:ue,fetchPriority:X,nonce:typeof y.nonce=="string"?y.nonce:void 0})}},on.preinitModule=function(N,y){if(typeof N=="string")if(typeof y=="object"&&y!==null){if(y.as==null||y.as==="script"){var Z=S(y.as,y.crossOrigin);c.d.M(N,{crossOrigin:Z,integrity:typeof y.integrity=="string"?y.integrity:void 0,nonce:typeof y.nonce=="string"?y.nonce:void 0,fetchPriority:typeof y.fetchPriority=="string"?y.fetchPriority:void 0})}}else y==null&&c.d.M(N)},on.preload=function(N,y){if(typeof N=="string"&&typeof y=="object"&&y!==null&&typeof y.as=="string"){var Z=y.as,ce=S(Z,y.crossOrigin);c.d.L(N,Z,{crossOrigin:ce,integrity:typeof y.integrity=="string"?y.integrity:void 0,nonce:typeof y.nonce=="string"?y.nonce:void 0,type:typeof y.type=="string"?y.type:void 0,fetchPriority:typeof y.fetchPriority=="string"?y.fetchPriority:void 0,referrerPolicy:typeof y.referrerPolicy=="string"?y.referrerPolicy:void 0,imageSrcSet:typeof y.imageSrcSet=="string"?y.imageSrcSet:void 0,imageSizes:typeof y.imageSizes=="string"?y.imageSizes:void 0,media:typeof y.media=="string"?y.media:void 0})}},on.preloadModule=function(N,y){if(typeof N=="string")if(y){var Z=S(y.as,y.crossOrigin);c.d.m(N,{as:typeof y.as=="string"&&y.as!=="script"?y.as:void 0,crossOrigin:Z,integrity:typeof y.integrity=="string"?y.integrity:void 0,nonce:typeof y.nonce=="string"?y.nonce:void 0,fetchPriority:typeof y.fetchPriority=="string"?y.fetchPriority:void 0})}else c.d.m(N)},on.requestFormReset=function(N){c.d.r(N)},on.unstable_batchedUpdates=function(N,y){return N(y)},on.useFormState=function(N,y,Z){return L.H.useFormState(N,y,Z)},on.useFormStatus=function(){return L.H.useHostTransitionStatus()},on.version="19.3.1",on}var Pc;function Jp(){if(Pc)return dr.exports;Pc=1;function d(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(d)}catch(g){console.error(g)}}return d(),dr.exports=Kp(),dr.exports}var eu;function $p(){if(eu)return Ci;eu=1;var d=Qp(),g=rr(),E=Jp();function c(e){var n="https://react.dev/errors/"+e;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var t=2;t<arguments.length;t++)n+="&args[]="+encodeURIComponent(arguments[t])}return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function b(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function M(e){for(var n=e,t=n;t&&!t.alternate;)n=t,(n.flags&4098)!==0&&(e=n.return),t=n.return;for(;n.return;)n=n.return;return n.tag===3?e:null}function _(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function A(e){if(e.tag===31){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function L(e){if(M(e)!==e)throw Error(c(188))}function S(e){var n=e.alternate;if(!n){if(n=M(e),n===null)throw Error(c(188));return n!==e?null:e}for(var t=e,a=n;;){var i=t.return;if(i===null)break;var l=i.alternate;if(l===null){if(a=i.return,a!==null){t=a;continue}break}if(i.child===l.child){for(l=i.child;l;){if(l===t)return L(i),e;if(l===a)return L(i),n;l=l.sibling}throw Error(c(188))}if(t.return!==a.return)t=i,a=l;else{for(var o=!1,s=i.child;s;){if(s===t){o=!0,t=i,a=l;break}if(s===a){o=!0,a=i,t=l;break}s=s.sibling}if(!o){for(s=l.child;s;){if(s===t){o=!0,t=l,a=i;break}if(s===a){o=!0,a=l,t=i;break}s=s.sibling}if(!o)throw Error(c(189))}}if(t.alternate!==a)throw Error(c(190))}if(t.tag!==3)throw Error(c(188));return t.stateNode.current===t?e:n}function N(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e;for(e=e.child;e!==null;){if(n=N(e),n!==null)return n;e=e.sibling}return null}function y(e,n,t,a,i,l){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&t(e,a,i,l)||(e.tag!==22||e.memoizedState===null)&&(n||e.tag!==5&&e.tag!==27)&&y(e.child,n,t,a,i,l))return!0;e=e.sibling}return!1}function Z(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function ce(e){var n=!1;for(e=e.return;e!==null&&(e.tag===4&&(n=!0),!(e.tag===3||e.tag===5||e.tag===27));)e=e.return;return n}function ue(e){var n=[null,null],t=Z(e);return t===null||X(n,e,t.child,{foundSelf:!1}),n}function X(e,n,t,a){for(;t!==null;){if(t===n)a.foundSelf=!0;else if(t.tag===5||t.tag===27||t.tag===6){if(a.foundSelf)return e[1]=t,!0;e[0]=t}else if((t.tag!==22||t.memoizedState===null)&&X(e,n,t.child,a))return!0;t=t.sibling}return!1}function Q(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(c(559))}}var ge=null,O=null;function Se(e,n,t){return e===t?!0:e===n?(ge=e,!0):!1}function me(e,n,t){return e===t?(O=e,!1):e===n?(O!==null&&(ge=e),!0):!1}function ye(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function Ne(e,n,t){for(var a=0,i=e;i;i=t(i))a++;i=0;for(var l=n;l;l=t(l))i++;for(;0<a-i;)e=t(e),a--;for(;0<i-a;)n=t(n),i--;for(;a--;){if(e===n||n!==null&&e===n.alternate)return e;e=t(e),n=t(n)}return null}var Y=Object.assign,ee=Symbol.for("react.element"),J=Symbol.for("react.transitional.element"),Ee=Symbol.for("react.portal"),Me=Symbol.for("react.fragment"),H=Symbol.for("react.strict_mode"),ie=Symbol.for("react.profiler"),je=Symbol.for("react.consumer"),de=Symbol.for("react.context"),j=Symbol.for("react.forward_ref"),$=Symbol.for("react.suspense"),F=Symbol.for("react.suspense_list"),he=Symbol.for("react.memo"),pe=Symbol.for("react.lazy"),Ge=Symbol.for("react.activity"),Fe=Symbol.for("react.legacy_hidden"),Tn=Symbol.for("react.memo_cache_sentinel"),m=Symbol.for("react.view_transition"),z=Symbol.for("react.recoverable"),R=Symbol.iterator;function q(e){return e===null||typeof e!="object"?null:(e=R&&e[R]||e["@@iterator"],typeof e=="function"?e:null)}var te=Symbol.for("react.client.reference");function oe(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===te?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Me:return"Fragment";case ie:return"Profiler";case H:return"StrictMode";case $:return"Suspense";case F:return"SuspenseList";case Ge:return"Activity";case m:return"ViewTransition"}if(typeof e=="object")switch(e.$$typeof){case Ee:return"Portal";case de:return e.displayName||"Context";case je:return(e._context.displayName||"Context")+".Consumer";case j:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case he:return n=e.displayName||null,n!==null?n:oe(e.type)||"Memo";case pe:n=e._payload,e=e._init;try{return oe(e(n))}catch{}}return null}var U=Array.isArray,D=g.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,P=E.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Kn={pending:!1,data:null,method:null,action:null},zi=[],An=-1;function Mn(e){return{current:e}}function Ze(e){0>An||(e.current=zi[An],zi[An]=null,An--)}function Le(e,n){An++,zi[An]=e.current,e.current=n}var _n=Mn(null),en=Mn(null),tt=Mn(null),at=Mn(null);function ua(e,n){switch(Le(tt,n),Le(en,e),Le(_n,null),n.nodeType){case 9:case 11:e=(e=n.documentElement)&&(e=e.namespaceURI)?Wm(e):0;break;default:if(e=n.tagName,n=n.namespaceURI)n=Wm(n),e=Fm(n,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}Ze(_n),Le(_n,e)}function Ot(){Ze(_n),Ze(en),Ze(tt)}function Ri(e){var n=e.memoizedState;n!==null&&(Ei._currentValue=n.memoizedState,Le(at,e)),n=_n.current;var t=Fm(n,e.type);n!==t&&(Le(en,e),Le(_n,t))}function le(e){en.current===e&&(Ze(_n),Ze(en)),at.current===e&&(Ze(at),Ei._currentValue=Kn)}var Ue,Ba;function Jn(e){if(Ue===void 0)try{throw Error()}catch(t){var n=t.stack.trim().match(/\n( *(at )?)/);Ue=n&&n[1]||"",Ba=-1<t.stack.indexOf(`
    at`)?" (<anonymous>)":-1<t.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Ue+e+Ba}var da=!1;function it(e,n){if(!e||da)return"";da=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var a={DetermineComponentFrameRoot:function(){try{if(n){var k=function(){throw Error()};if(Object.defineProperty(k.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(k,[])}catch(I){var p=I}Reflect.construct(e,[],k)}else{try{k.call()}catch(I){p=I}k=!1;try{var w=Object.getOwnPropertyDescriptor(e.prototype,"props");Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),k=!0,new e}finally{k&&(w!==void 0?Object.defineProperty(e.prototype,"props",w):delete e.prototype.props)}}}else{try{throw Error()}catch(I){p=I}(k=e())&&typeof k.catch=="function"&&k.catch(function(){})}}catch(I){if(I&&p&&typeof I.stack=="string")return[I.stack,p.stack]}return[null,null]}};a.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var i=Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot,"name");i&&i.configurable&&Object.defineProperty(a.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var l=a.DetermineComponentFrameRoot(),o=l[0],s=l[1];if(o&&s){var u=o.split(`
`),v=s.split(`
`);for(i=a=0;a<u.length&&!u[a].includes("DetermineComponentFrameRoot");)a++;for(;i<v.length&&!v[i].includes("DetermineComponentFrameRoot");)i++;if(a===u.length||i===v.length)for(a=u.length-1,i=v.length-1;1<=a&&0<=i&&u[a]!==v[i];)i--;for(;1<=a&&0<=i;a--,i--)if(u[a]!==v[i]){if(a!==1||i!==1)do if(a--,i--,0>i||u[a]!==v[i]){var T=`
`+u[a].replace(" at new "," at ");return e.displayName&&T.includes("<anonymous>")&&(T=T.replace("<anonymous>",e.displayName)),T}while(1<=a&&0<=i);break}}}finally{da=!1,Error.prepareStackTrace=t}return(t=e?e.displayName||e.name:"")?Jn(t):""}function th(e,n){switch(e.tag){case 26:case 27:case 5:return Jn(e.type);case 16:return Jn("Lazy");case 13:return e.child!==n&&n!==null?Jn("Suspense Fallback"):Jn("Suspense");case 19:return Jn("SuspenseList");case 0:case 15:return it(e.type,!1);case 11:return it(e.type.render,!1);case 1:return it(e.type,!0);case 31:return Jn("Activity");case 30:return Jn("ViewTransition");default:return""}}function bu(e){try{var n="",t=null;do n+=th(e,t),t=e,e=e.return;while(e);return n}catch(a){return`
Error generating stack: `+a.message+`
`+a.stack}}var gr=Object.prototype.hasOwnProperty,hr=d.unstable_scheduleCallback,vr=d.unstable_cancelCallback,ah=d.unstable_shouldYield,ih=d.unstable_requestPaint,Cn=d.unstable_now,lh=d.unstable_getCurrentPriorityLevel,yu=d.unstable_ImmediatePriority,xu=d.unstable_UserBlockingPriority,zl=d.unstable_NormalPriority,oh=d.unstable_LowPriority,wu=d.unstable_IdlePriority,rh=d.log,sh=d.unstable_setDisableYieldValue,Oi=null,kn=null;function jt(e){if(typeof rh=="function"&&sh(e),kn&&typeof kn.setStrictMode=="function")try{kn.setStrictMode(Oi,e)}catch{}}var Nn=Math.clz32?Math.clz32:dh,ch=Math.log,uh=Math.LN2;function dh(e){return e>>>=0,e===0?32:31-(ch(e)/uh|0)|0}var Rl=256,Ol=262144,jl=4194304;function fa(e){var n=e&42;if(n!==0)return n;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Dl(e,n,t){var a=e.pendingLanes;if(a===0)return 0;var i=0,l=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=a&134217727;return s!==0?(a=s&~l,a!==0?i=fa(a):(o&=s,o!==0?i=fa(o):t||(t=s&~e,t!==0&&(i=fa(t))))):(s=a&~l,s!==0?i=fa(s):o!==0?i=fa(o):t||(t=a&~e,t!==0&&(i=fa(t)))),i===0?0:n!==0&&n!==i&&(n&l)===0&&(l=i&-i,t=n&-n,l>=t||l===32&&(t&4194048)!==0)?n:i}function ji(e,n){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&n)===0}function Su(e,n){(n&8)!==0&&(n|=n&32);var t=e.entangledLanes;if(t!==0)for(e=e.entanglements,t&=n;0<t;){var a=31-Nn(t),i=1<<a;n|=e[a],t&=~i}return n}function fh(e,n){switch(e){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Eu(){var e=jl;return jl<<=1,(jl&62914560)===0&&(jl=4194304),e}function br(e){for(var n=[],t=0;31>t;t++)n.push(e);return n}function Di(e,n){e.pendingLanes|=n,n!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function mh(e,n,t,a,i,l){var o=e.pendingLanes;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=t,e.entangledLanes&=t,e.errorRecoveryDisabledLanes&=t,e.shellSuspendCounter=0;var s=e.entanglements,u=e.expirationTimes,v=e.hiddenUpdates;for(t=o&~t;0<t;){var T=31-Nn(t),k=1<<T;s[T]=0,u[T]=-1;var p=v[T];if(p!==null)for(v[T]=null,T=0;T<p.length;T++){var w=p[T];w!==null&&(w.lane&=-536870913)}t&=~k}a!==0&&Tu(e,a,0),l!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=l&~(o&~n))}function Tu(e,n,t){e.pendingLanes|=n,e.suspendedLanes&=~n;var a=31-Nn(n);e.entangledLanes|=n,e.entanglements[a]=e.entanglements[a]|1073741824|t&261930}function Au(e,n){var t=e.entangledLanes|=n;for(e=e.entanglements;t;){var a=31-Nn(t),i=1<<a;i&n|e[a]&n&&(e[a]|=n),t&=~i}}function Mu(e,n){var t=n&-n;return t=(t&42)!==0?1:yr(t),(t&(e.suspendedLanes|n))!==0?0:t}function yr(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function xr(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Cu(){var e=P.p;return e!==0?e:(e=window.event,e===void 0?32:Dp(e.type))}function ku(e,n){var t=P.p;try{return P.p=e,n()}finally{P.p=t}}var ht=Math.random().toString(36).slice(2),rn="__reactFiber$"+ht,bn="__reactProps$"+ht,Ia="__reactContainer$"+ht,Nu="__reactEvents$"+ht,ph="__reactListeners$"+ht,gh="__reactHandles$"+ht,Lu="__reactResources$"+ht,Bi="__reactMarker$"+ht,Bl="__reactLoad$"+ht;function Il(e){delete e[rn],delete e[bn],delete e[ph],delete e[gh]}function ma(e){var n;if(n=e[rn])return n;for(var t=e.parentNode;t;){if(n=t[Ia]||t[rn]){if(t=n.alternate,n.child!==null||t!==null&&t.child!==null)for(e=gp(e);e!==null;){if(t=e[rn])return t;e=gp(e)}return n}e=t,t=e.parentNode}return null}function _a(e){if(e=e[rn]||e[Ia]){var n=e.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return e}return null}function Ii(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e.stateNode;throw Error(c(33))}function Ha(e){var n=e[Lu];return n||(n=e[Lu]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function nn(e){e[Bi]=!0}function zu(e){e[Bl]=void 0}var Ru=new Set,Ou={};function pa(e,n){Ua(e,n),Ua(e+"Capture",n)}function Ua(e,n){for(Ou[e]=n,e=0;e<n.length;e++)Ru.add(n[e])}var hh=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),ju={},Du={};function vh(e){return gr.call(Du,e)?!0:gr.call(ju,e)?!1:hh.test(e)?Du[e]=!0:(ju[e]=!0,!1)}var Ae=!1;function Bu(){var e=Ae;return Ae=!1,e}function _l(e,n,t){if(vh(n))if(t===null)e.removeAttribute(n);else{switch(typeof t){case"undefined":case"function":case"symbol":e.removeAttribute(n);return;case"boolean":var a=n.toLowerCase().slice(0,5);if(a!=="data-"&&a!=="aria-"){e.removeAttribute(n);return}}e.setAttribute(n,t)}}function Hl(e,n,t){if(t===null)e.removeAttribute(n);else{switch(typeof t){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttribute(n,t)}}function vt(e,n,t,a){if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttributeNS(n,t,a)}}function Ln(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Iu(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function bh(e,n,t){var a=Object.getOwnPropertyDescriptor(e.constructor.prototype,n);if(!e.hasOwnProperty(n)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var i=a.get,l=a.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return i.call(this)},set:function(o){t=""+o,l.call(this,o)}}),Object.defineProperty(e,n,{enumerable:a.enumerable}),{getValue:function(){return t},setValue:function(o){t=""+o},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function wr(e){if(!e._valueTracker){var n=Iu(e)?"checked":"value";e._valueTracker=bh(e,n,""+e[n])}}function _u(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var t=n.getValue(),a="";return e&&(a=Iu(e)?e.checked?"true":"false":e.value),e=a,e!==t?(n.setValue(e),!0):!1}var yh=/[\n"\\]/g;function Hn(e){return e.replace(yh,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function Sr(e,n,t,a,i,l,o,s){e.name="",o!=null&&typeof o!="function"&&typeof o!="symbol"&&typeof o!="boolean"?e.type=o:e.removeAttribute("type"),n!=null?o==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+Ln(n)):e.value!==""+Ln(n)&&(e.value=""+Ln(n)):o!=="submit"&&o!=="reset"||e.removeAttribute("value"),n!=null?o==="number"&&e.value==n?Er(e,Ln(e.value)):Er(e,Ln(n)):t!=null?Er(e,Ln(t)):a!=null&&e.removeAttribute("value"),i==null&&l!=null&&(e.defaultChecked=!!l),i!=null&&(e.checked=i&&typeof i!="function"&&typeof i!="symbol"),s!=null&&typeof s!="function"&&typeof s!="symbol"&&typeof s!="boolean"?e.name=""+Ln(s):e.removeAttribute("name")}function Hu(e,n,t,a,i,l,o,s){if(l!=null&&typeof l!="function"&&typeof l!="symbol"&&typeof l!="boolean"&&(e.type=l),n!=null||t!=null){if(!(l!=="submit"&&l!=="reset"||n!=null)){wr(e);return}t=t!=null?""+Ln(t):"",n=n!=null?""+Ln(n):t,s||n===e.value||(e.value=n),e.defaultValue=n}a=a??i,a=typeof a!="function"&&typeof a!="symbol"&&!!a,e.checked=s?e.checked:!!a,e.defaultChecked=!!a,o!=null&&typeof o!="function"&&typeof o!="symbol"&&typeof o!="boolean"&&(e.name=o),wr(e)}function Er(e,n){e.defaultValue!==""+n&&(e.defaultValue=""+n)}function qa(e,n,t,a){if(e=e.options,n){n={};for(var i=0;i<t.length;i++)n["$"+t[i]]=!0;for(t=0;t<e.length;t++)i=n.hasOwnProperty("$"+e[t].value),e[t].selected!==i&&(e[t].selected=i),i&&a&&(e[t].defaultSelected=!0)}else{for(t=""+Ln(t),n=null,i=0;i<e.length;i++){if(e[i].value===t){e[i].selected=!0,a&&(e[i].defaultSelected=!0);return}n!==null||e[i].disabled||(n=e[i])}n!==null&&(n.selected=!0)}}function Uu(e,n,t){if(n!=null&&(n=""+Ln(n),n!==e.value&&(e.value=n),t==null)){e.defaultValue!==n&&(e.defaultValue=n);return}e.defaultValue=t!=null?""+Ln(t):""}function qu(e,n,t,a){if(n==null){if(a!=null){if(t!=null)throw Error(c(92));if(U(a)){if(1<a.length)throw Error(c(93));a=a[0]}t=a}t==null&&(t=""),n=t}t=Ln(n),e.defaultValue=t,a=e.textContent,a===t&&a!==""&&a!==null&&(e.value=a),wr(e)}function Ga(e,n){if(n){var t=e.firstChild;if(t&&t===e.lastChild&&t.nodeType===3){t.nodeValue=n;return}}e.textContent=n}var xh=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Gu(e,n,t){var a=n.indexOf("--")===0;t==null||typeof t=="boolean"||t===""?a?e.setProperty(n,""):n==="float"?e.cssFloat="":e[n]="":a?e.setProperty(n,t):typeof t!="number"||t===0||xh.has(n)?n==="float"?e.cssFloat=t:e[n]=(""+t).trim():e[n]=t+"px"}function Vu(e,n,t){if(n!=null&&typeof n!="object")throw Error(c(62));if(e=e.style,t!=null){for(var a in t)!t.hasOwnProperty(a)||n!=null&&n.hasOwnProperty(a)||(a.indexOf("--")===0?e.setProperty(a,""):a==="float"?e.cssFloat="":e[a]="",Ae=!0);for(var i in n)a=n[i],n.hasOwnProperty(i)&&t[i]!==a&&(Gu(e,i,a),Ae=!0)}else for(var l in n)n.hasOwnProperty(l)&&Gu(e,l,n[l])}function Tr(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var wh=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Sh=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Ul(e){return Sh.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function lt(){}var Ar=null;function Mr(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Va=null,Ya=null;function Yu(e){var n=_a(e);if(n&&(e=n.stateNode)){var t=e[bn]||null;e:switch(e=n.stateNode,n.type){case"input":if(Sr(e,t.value,t.defaultValue,t.defaultValue,t.checked,t.defaultChecked,t.type,t.name),n=t.name,t.type==="radio"&&n!=null){for(t=e;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll('input[name="'+Hn(""+n)+'"][type="radio"]'),n=0;n<t.length;n++){var a=t[n];if(a!==e&&a.form===e.form){var i=a[bn]||null;if(!i)throw Error(c(90));Sr(a,i.value,i.defaultValue,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name)}}for(n=0;n<t.length;n++)a=t[n],a.form===e.form&&_u(a)}break e;case"textarea":Uu(e,t.value,t.defaultValue);break e;case"select":n=t.value,n!=null&&qa(e,!!t.multiple,n,!1)}}}var Cr=!1;function Xu(e,n,t){if(Cr)return e(n,t);Cr=!0;try{var a=e(n);return a}finally{if(Cr=!1,(Va!==null||Ya!==null)&&(qo(),Va&&(n=Va,e=Ya,Ya=Va=null,Yu(n),e)))for(n=0;n<e.length;n++)Yu(e[n])}}function _i(e,n){var t=e.stateNode;if(t===null)return null;var a=t[bn]||null;if(a===null)return null;t=a[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(a=!a.disabled)||(e=e.type,a=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!a;break e;default:e=!1}if(e)return null;if(t&&typeof t!="function")throw Error(c(231,n,typeof t));return t}var bt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),kr=!1;if(bt)try{var Hi={};Object.defineProperty(Hi,"passive",{get:function(){kr=!0}}),window.addEventListener("test",Hi,Hi),window.removeEventListener("test",Hi,Hi)}catch{kr=!1}var Dt=null,Nr=null,ql=null;function Zu(){if(ql)return ql;var e,n=Nr,t=n.length,a,i="value"in Dt?Dt.value:Dt.textContent,l=i.length;for(e=0;e<t&&n[e]===i[e];e++);var o=t-e;for(a=1;a<=o&&n[t-a]===i[l-a];a++);return ql=i.slice(e,1<a?1-a:void 0)}function Gl(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function Vl(){return!0}function Qu(){return!1}function pn(e){function n(t,a,i,l,o){this._reactName=t,this._targetInst=i,this.type=a,this.nativeEvent=l,this.target=o,this.currentTarget=null;for(var s in e)e.hasOwnProperty(s)&&(t=e[s],this[s]=t?t(l):l[s]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?Vl:Qu,this.isPropagationStopped=Qu,this}return Y(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=Vl)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=Vl)},persist:function(){},isPersistent:Vl}),n}var Bt={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Yl=pn(Bt),Ui=Y({},Bt,{view:0,detail:0}),Eh=pn(Ui),Lr,zr,qi,Xl=Y({},Ui,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Or,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==qi&&(qi&&e.type==="mousemove"?(Lr=e.screenX-qi.screenX,zr=e.screenY-qi.screenY):zr=Lr=0,qi=e),Lr)},movementY:function(e){return"movementY"in e?e.movementY:zr}}),Ku=pn(Xl),Th=Y({},Xl,{dataTransfer:0}),Ah=pn(Th),Mh=Y({},Ui,{relatedTarget:0}),Rr=pn(Mh),Ch=Y({},Bt,{animationName:0,elapsedTime:0,pseudoElement:0}),kh=pn(Ch),Nh=Y({},Bt,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Lh=pn(Nh),zh=Y({},Bt,{data:0}),Ju=pn(zh),Rh={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Oh={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},jh={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Dh(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=jh[e])?!!n[e]:!1}function Or(){return Dh}var Bh=Y({},Ui,{key:function(e){if(e.key){var n=Rh[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=Gl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Oh[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Or,charCode:function(e){return e.type==="keypress"?Gl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Gl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Ih=pn(Bh),_h=Y({},Xl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),$u=pn(_h),Hh=Y({},Bt,{submitter:0}),Uh=pn(Hh),qh=Y({},Ui,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Or}),Gh=pn(qh),Vh=Y({},Bt,{propertyName:0,elapsedTime:0,pseudoElement:0}),Yh=pn(Vh),Xh=Y({},Xl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Zh=pn(Xh),Qh=Y({},Bt,{newState:0,oldState:0,source:0}),Kh=pn(Qh),Jh=[9,13,27,32],jr=bt&&"CompositionEvent"in window,Gi=null;bt&&"documentMode"in document&&(Gi=document.documentMode);var $h=bt&&"TextEvent"in window&&!Gi,Wu=bt&&(!jr||Gi&&8<Gi&&11>=Gi),Fu=" ",Pu=!1;function ed(e,n){switch(e){case"keyup":return Jh.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function nd(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Xa=!1;function Wh(e,n){switch(e){case"compositionend":return nd(n);case"keypress":return n.which!==32?null:(Pu=!0,Fu);case"textInput":return e=n.data,e===Fu&&Pu?null:e;default:return null}}function Fh(e,n){if(Xa)return e==="compositionend"||!jr&&ed(e,n)?(e=Zu(),ql=Nr=Dt=null,Xa=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return Wu&&n.locale!=="ko"?null:n.data;default:return null}}var Ph={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function td(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!Ph[e.type]:n==="textarea"}function ad(e,n,t,a){Va?Ya?Ya.push(a):Ya=[a]:Va=a,n=Qo(n,"onChange"),0<n.length&&(t=new Yl("onChange","change",null,t,a),e.push({event:t,listeners:n}))}var Vi=null,Yi=null;function ev(e){Xm(e,0)}function Zl(e){var n=Ii(e);if(_u(n))return e}function id(e,n){if(e==="change")return n}var ld=!1;if(bt){var Dr;if(bt){var Br="oninput"in document;if(!Br){var od=document.createElement("div");od.setAttribute("oninput","return;"),Br=typeof od.oninput=="function"}Dr=Br}else Dr=!1;ld=Dr&&(!document.documentMode||9<document.documentMode)}function rd(){Vi&&(Vi.detachEvent("onpropertychange",sd),Yi=Vi=null)}function sd(e){if(e.propertyName==="value"&&Zl(Yi)){var n=[];ad(n,Yi,e,Mr(e)),Xu(ev,n)}}function nv(e,n,t){e==="focusin"?(rd(),Vi=n,Yi=t,Vi.attachEvent("onpropertychange",sd)):e==="focusout"&&rd()}function tv(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Zl(Yi)}function av(e,n){if(e==="click")return Zl(n)}function iv(e,n){if(e==="input"||e==="change")return Zl(n)}function lv(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var zn=typeof Object.is=="function"?Object.is:lv;function Xi(e,n){if(zn(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var t=Object.keys(e),a=Object.keys(n);if(t.length!==a.length)return!1;for(a=0;a<t.length;a++){var i=t[a];if(!gr.call(n,i)||!zn(e[i],n[i]))return!1}return!0}function Ir(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function cd(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function ud(e,n){var t=cd(e);e=0;for(var a;t;){if(t.nodeType===3){if(a=e+t.textContent.length,e<=n&&a>=n)return{node:t,offset:n-e};e=a}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=cd(t)}}function dd(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?dd(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function fd(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var n=Ir(e.document);n instanceof e.HTMLIFrameElement;){try{var t=typeof n.contentWindow.location.href=="string"}catch{t=!1}if(t)e=n.contentWindow;else break;n=Ir(e.document)}return n}function _r(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}var ov=bt&&"documentMode"in document&&11>=document.documentMode,Za=null,Hr=null,Zi=null,Ur=!1;function md(e,n,t){var a=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;Ur||Za==null||Za!==Ir(a)||(a=Za,"selectionStart"in a&&_r(a)?a={start:a.selectionStart,end:a.selectionEnd}:(a=(a.ownerDocument&&a.ownerDocument.defaultView||window).getSelection(),a={anchorNode:a.anchorNode,anchorOffset:a.anchorOffset,focusNode:a.focusNode,focusOffset:a.focusOffset}),Zi&&Xi(Zi,a)||(Zi=a,a=Qo(Hr,"onSelect"),0<a.length&&(n=new Yl("onSelect","select",null,n,t),e.push({event:n,listeners:a}),n.target=Za)))}function ga(e,n){var t={};return t[e.toLowerCase()]=n.toLowerCase(),t["Webkit"+e]="webkit"+n,t["Moz"+e]="moz"+n,t}var Qa={animationend:ga("Animation","AnimationEnd"),animationiteration:ga("Animation","AnimationIteration"),animationstart:ga("Animation","AnimationStart"),transitionrun:ga("Transition","TransitionRun"),transitionstart:ga("Transition","TransitionStart"),transitioncancel:ga("Transition","TransitionCancel"),transitionend:ga("Transition","TransitionEnd")},qr={},pd={};bt&&(pd=document.createElement("div").style,"AnimationEvent"in window||(delete Qa.animationend.animation,delete Qa.animationiteration.animation,delete Qa.animationstart.animation),"TransitionEvent"in window||delete Qa.transitionend.transition);function ha(e){if(qr[e])return qr[e];if(!Qa[e])return e;var n=Qa[e],t;for(t in n)if(n.hasOwnProperty(t)&&t in pd)return qr[e]=n[t];return e}var gd=ha("animationend"),hd=ha("animationiteration"),vd=ha("animationstart"),rv=ha("transitionrun"),sv=ha("transitionstart"),cv=ha("transitioncancel"),bd=ha("transitionend"),yd=new Map,Gr="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Gr.push("scrollEnd");function $n(e,n){yd.set(e,n),pa(n,[e])}var uv=0;function yt(e,n){if(e.name!=null&&e.name!=="auto")return e.name;if(n.autoName!==null)return n.autoName;e=et.identifierPrefix;var t=uv++;return e="_"+e+"t_"+t.toString(32)+"_",n.autoName=e}function xd(e){if(e==null||typeof e=="string")return e;var n=null,t=mi;if(t!==null)for(var a=0;a<t.length;a++){var i=e[t[a]];if(i!=null){if(i==="none")return"none";n=n==null?i:n+(" "+i)}}return n??e.default}function xt(e,n){return e=xd(e),n=xd(n),n==null?e==="auto"?null:e:n==="auto"?null:n}var Ql=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},Un=[],Ka=0,Vr=0;function Kl(){for(var e=Ka,n=Vr=Ka=0;n<e;){var t=Un[n];Un[n++]=null;var a=Un[n];Un[n++]=null;var i=Un[n];Un[n++]=null;var l=Un[n];if(Un[n++]=null,a!==null&&i!==null){var o=a.pending;o===null?i.next=i:(i.next=o.next,o.next=i),a.pending=i}l!==0&&wd(t,i,l)}}function Jl(e,n,t,a){Un[Ka++]=e,Un[Ka++]=n,Un[Ka++]=t,Un[Ka++]=a,Vr|=a,e.lanes|=a,e=e.alternate,e!==null&&(e.lanes|=a)}function Yr(e,n,t,a){return Jl(e,n,t,a),$l(e)}function va(e,n){return Jl(e,null,null,n),$l(e)}function wd(e,n,t){e.lanes|=t;var a=e.alternate;a!==null&&(a.lanes|=t);for(var i=!1,l=e.return;l!==null;)l.childLanes|=t,a=l.alternate,a!==null&&(a.childLanes|=t),l.tag===22&&(e=l.stateNode,e===null||e._visibility&1||(i=!0)),e=l,l=l.return;return e.tag===3?(l=e.stateNode,i&&n!==null&&(i=31-Nn(t),e=l.hiddenUpdates,a=e[i],a===null?e[i]=[n]:a.push(n),n.lane=t|536870912),l):null}function $l(e){if(50<pl)throw pl=0,Uo=null,Error(c(185));for(var n=e.return;n!==null;)e=n,n=e.return;return e.tag===3?e.stateNode:null}var Ja={};function dv(e,n,t,a){this.tag=e,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=a,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function yn(e,n,t,a){return new dv(e,n,t,a)}function Xr(e){return e=e.prototype,!(!e||!e.isReactComponent)}function wt(e,n){var t=e.alternate;return t===null?(t=yn(e.tag,n,e.key,e.mode),t.elementType=e.elementType,t.type=e.type,t.stateNode=e.stateNode,t.alternate=e,e.alternate=t):(t.pendingProps=n,t.type=e.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=e.flags&1206910976,t.childLanes=e.childLanes,t.lanes=e.lanes,t.child=e.child,t.memoizedProps=e.memoizedProps,t.memoizedState=e.memoizedState,t.updateQueue=e.updateQueue,n=e.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},t.sibling=e.sibling,t.index=e.index,t.ref=e.ref,t.refCleanup=e.refCleanup,t}function Sd(e,n){e.flags&=1206910978;var t=e.alternate;return t===null?(e.childLanes=0,e.lanes=n,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=t.childLanes,e.lanes=t.lanes,e.child=t.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=t.memoizedProps,e.memoizedState=t.memoizedState,e.updateQueue=t.updateQueue,e.type=t.type,n=t.dependencies,e.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),e}function Wl(e,n,t,a,i,l){var o=0;if(a=e,typeof a=="function")Xr(a)&&(o=1);else if(typeof a=="string")o=Hb(e,t,_n.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(a){case Ge:return e=yn(31,t,n,i),e.elementType=Ge,e.lanes=l,e;case Me:return ba(t.children,i,l,n);case H:o=8,i|=24;break;case ie:return e=yn(12,t,n,i|2),e.elementType=ie,e.lanes=l,e;case $:return e=yn(13,t,n,i),e.elementType=$,e.lanes=l,e;case F:return e=yn(19,t,n,i),e.elementType=F,e.lanes=l,e;case Fe:case m:return e=i|32,e=yn(30,t,n,e),e.elementType=m,e.lanes=l,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof a=="object"&&a!==null)switch(a.$$typeof){case de:o=10;break e;case je:o=9;break e;case j:o=11;break e;case he:o=14;break e;case pe:o=16,a=null;break e}o=29,t=Error(c(130,e===null?"null":typeof e,"")),a=null}return n=yn(o,t,n,i),n.elementType=e,n.type=a,n.lanes=l,n}function ba(e,n,t,a){return e=yn(7,e,a,n),e.lanes=t,e}function Zr(e,n,t){return e=yn(6,e,null,n),e.lanes=t,e}function Ed(e){var n=yn(18,null,null,0);return n.stateNode=e,n}function Qr(e,n,t){return n=yn(4,e.children!==null?e.children:[],e.key,n),n.lanes=t,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}var Td=new WeakMap;function qn(e,n){if(typeof e=="object"&&e!==null){var t=Td.get(e);return t!==void 0?t:(n={value:e,source:n,stack:bu(n)},Td.set(e,n),n)}return{value:e,source:n,stack:bu(n)}}var $a=[],Wa=0,Fl=null,Qi=0,Gn=[],Vn=0,It=null,ot=1,rt="";function St(e,n){$a[Wa++]=Qi,$a[Wa++]=Fl,Fl=e,Qi=n}function Ad(e,n,t){Gn[Vn++]=ot,Gn[Vn++]=rt,Gn[Vn++]=It,It=e;var a=ot;e=rt;var i=32-Nn(a)-1;a&=~(1<<i),t+=1;var l=32-Nn(n)+i;if(30<l){var o=i-i%5;l=(a&(1<<o)-1).toString(32),a>>=o,i-=o,ot=1<<32-Nn(n)+i|t<<i|a,rt=l+e}else ot=1<<l|t<<i|a,rt=e}function Pl(e){e.return!==null&&(St(e,1),Ad(e,1,0))}function Kr(e){for(;e===Fl;)Fl=$a[--Wa],$a[Wa]=null,Qi=$a[--Wa],$a[Wa]=null;for(;e===It;)It=Gn[--Vn],Gn[Vn]=null,rt=Gn[--Vn],Gn[Vn]=null,ot=Gn[--Vn],Gn[Vn]=null}function Md(e,n){Gn[Vn++]=ot,Gn[Vn++]=rt,Gn[Vn++]=It,ot=n.id,rt=n.overflow,It=e}var tn=null,Ie=null,fe=!1,_t=null,Yn=!1,Jr=Error(c(519));function Ht(e){var n=Error(c(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Ki(qn(n,e)),Jr}function Cd(e){var n=e.stateNode,t=e.type,a=e.memoizedProps;switch(n[rn]=e,n[bn]=a,t){case"dialog":be("cancel",n),be("close",n);break;case"iframe":case"object":case"embed":be("load",n);break;case"video":case"audio":for(t=0;t<hl.length;t++)be(hl[t],n);break;case"source":be("error",n);break;case"img":case"image":case"link":be("error",n),be("load",n);break;case"details":be("toggle",n);break;case"input":be("invalid",n),Hu(n,a.value,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name,!0);break;case"select":be("invalid",n);break;case"textarea":be("invalid",n),qu(n,a.value,a.defaultValue,a.children)}t=a.children,typeof t!="string"&&typeof t!="number"&&typeof t!="bigint"||n.textContent===""+t||a.suppressHydrationWarning===!0||Jm(n.textContent,t)?(a.popover!=null&&(be("beforetoggle",n),be("toggle",n)),a.onScroll!=null&&be("scroll",n),a.onScrollEnd!=null&&be("scrollend",n),a.onClick!=null&&(n.onclick=lt),n=!0):n=!1,n||Ht(e,!0)}function eo(e){for(tn=e.return;tn;)switch(tn.tag){case 5:case 31:case 13:Yn=!1;return;case 27:case 3:Yn=!0;return;default:tn=tn.return}}function Fa(e){if(e!==tn)return!1;if(!fe)return eo(e),fe=!0,!1;var n=e.tag,t;if((t=n!==3&&n!==27)&&((t=n===5)&&(t=e.type,t=!(t!=="form"&&t!=="button")||Ac(e.type,e.memoizedProps)),t=!t),t&&Ie&&Ht(e),eo(e),n===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(317));Ie=pp(e)}else if(n===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(317));Ie=pp(e)}else n===27?(n=Ie,na(e.type)?(e=jc,jc=null,Ie=e):Ie=n):Ie=tn?Zn(e.stateNode.nextSibling):null;return!0}function ya(){Ie=tn=null,fe=!1}function $r(){var e=_t;return e!==null&&(Sn===null?Sn=e:Sn.push.apply(Sn,e),_t=null),e}function Ki(e){_t===null?_t=[e]:_t.push(e)}var Wr=Mn(null),xa=null,Et=null;function Ut(e,n,t){Le(Wr,n._currentValue),n._currentValue=t}function Tt(e){e._currentValue=Wr.current,Ze(Wr)}function no(e,n,t){for(;e!==null;){var a=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,a!==null&&(a.childLanes|=n)):a!==null&&(a.childLanes&n)!==n&&(a.childLanes|=n),e===t)break;e=e.return}}function Fr(e,n,t,a){var i=e.child;for(i!==null&&(i.return=e);i!==null;){var l=i.dependencies;if(l!==null){var o=i.child;l=l.firstContext;e:for(;l!==null;){var s=l;l=i;for(var u=0;u<n.length;u++)if(s.context===n[u]){l.lanes|=t,s=l.alternate,s!==null&&(s.lanes|=t),no(l.return,t,e),a||(o=null);break e}l=s.next}}else if(i.tag===18){if(o=i.return,o===null)throw Error(c(341));o.lanes|=t,l=o.alternate,l!==null&&(l.lanes|=t),no(o,t,e),o=null}else i.tag===13&&i.memoizedState!==null&&i.memoizedState.dehydrated===null?(i.lanes|=t,o=i.alternate,o!==null&&(o.lanes|=t),no(i.return,t,e),o=i.child,o=o!==null?o.sibling:null):o=i.child;if(o!==null)o.return=i;else for(o=i;o!==null;){if(o===e){o=null;break}if(i=o.sibling,i!==null){i.return=o.return,o=i;break}o=o.return}i=o}}function wa(e,n,t,a){e=null;for(var i=n,l=!1;i!==null;){if(!l){if((i.flags&524288)!==0)l=!0;else if((i.flags&262144)!==0)break}if(i.tag===10){var o=i.alternate;if(o===null)throw Error(c(387));if(o=o.memoizedProps,o!==null){var s=i.type;zn(i.pendingProps.value,o.value)||(e!==null?e.push(s):e=[s])}}else if(i===at.current){if(o=i.alternate,o===null)throw Error(c(387));o.memoizedState.memoizedState!==i.memoizedState.memoizedState&&(e!==null?e.push(Ei):e=[Ei])}i=i.return}return e!==null&&Fr(n,e,t,a),n.flags|=262144,e!==null}function to(e){for(e=e.firstContext;e!==null;){if(!zn(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Sa(e){xa=e,Et=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function sn(e){return kd(xa,e)}function ao(e,n){return xa===null&&Sa(e),kd(e,n)}function kd(e,n){var t=n._currentValue;if(n={context:n,memoizedValue:t,next:null},Et===null){if(e===null)throw Error(c(308));Et=n,e.dependencies={lanes:0,firstContext:n},e.flags|=524288}else Et=Et.next=n;return t}var fv=typeof AbortController<"u"?AbortController:function(){var e=[],n=this.signal={aborted:!1,addEventListener:function(t,a){e.push(a)}};this.abort=function(){n.aborted=!0,e.forEach(function(t){return t()})}},mv=d.unstable_scheduleCallback,pv=d.unstable_NormalPriority,Ke={$$typeof:de,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Pr(){return{controller:new fv,data:new Map,refCount:0}}function Ji(e){e.refCount--,e.refCount===0&&mv(pv,function(){e.controller.abort()})}function Nd(e,n){if((e.pendingLanes&4194048)!==0){var t=e.transitionTypes;for(t===null&&(t=e.transitionTypes=[]),e=0;e<n.length;e++){var a=n[e];t.indexOf(a)===-1&&t.push(a)}}}var $i=null;function gv(e){var n=e.transitionTypes;return e.transitionTypes=null,n}var Wi=null,es=0,Ea=0,Pa=null;function hv(e,n){if(Wi===null){var t=Wi=[];es=0,Ea=hc(),Pa={status:"pending",value:void 0,then:function(a){t.push(a)}}}return es++,n.then(Ld,Ld),n}function Ld(){if(--es===0&&($i=null,Wi!==null)){Pa!==null&&(Pa.status="fulfilled");var e=Wi;Wi=null,Ea=0,Pa=null;for(var n=0;n<e.length;n++)(0,e[n])()}}function vv(e,n){var t=[],a={status:"pending",value:null,reason:null,then:function(i){t.push(i)}};return e.then(function(){a.status="fulfilled",a.value=n;for(var i=0;i<t.length;i++)(0,t[i])(n)},function(i){for(a.status="rejected",a.reason=i,i=0;i<t.length;i++)(0,t[i])(void 0)}),a}var zd=D.S;D.S=function(e,n){if(Tm=Cn(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&hv(e,n),$i!==null)for(var t=vi;t!==null;)Nd(t,$i),t=t.next;if(t=e.types,t!==null){for(var a=vi;a!==null;)Nd(a,t),a=a.next;if(Ea!==0){a=$i,a===null&&(a=$i=[]);for(var i=0;i<t.length;i++){var l=t[i];a.indexOf(l)===-1&&a.push(l)}}}zd!==null&&zd(e,n)};var Ta=Mn(null);function ns(){var e=Ta.current;return e!==null?e:Be.pooledCache}function io(e,n){n===null?Le(Ta,Ta.current):Le(Ta,n.pool)}function Rd(){var e=ns();return e===null?null:{parent:Ke._currentValue,pool:e}}var ei=Error(c(460)),ts=Error(c(474)),lo=Error(c(542)),oo={then:function(){}};function Od(e){return e=e.status,e==="fulfilled"||e==="rejected"}function jd(e,n,t){switch(t=e[t],t===void 0?e.push(n):t!==n&&(n.then(lt,lt),n=t),n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Bd(e),e===void 0&&!("reason"in n)?Error(c(600)):e;default:if(typeof n.status=="string")n.then(lt,lt);else{if(e=Be,e!==null&&100<e.shellSuspendCounter)throw Error(c(482));e=n,e.status="pending",e.then(function(a){if(n.status==="pending"){var i=n;i.status="fulfilled",i.value=a}},function(a){if(n.status==="pending"){var i=n;i.status="rejected",i.reason=a}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Bd(e),e}throw Ma=n,ei}}function Aa(e){try{var n=e._init;return n(e._payload)}catch(t){throw t!==null&&typeof t=="object"&&typeof t.then=="function"?(Ma=t,ei):t}}var Ma=null;function Dd(){if(Ma===null)throw Error(c(459));var e=Ma;return Ma=null,e}function Bd(e){if(e===ei||e===lo)throw Error(c(483))}var ni=null,Fi=0;function ro(e){var n=Fi;return Fi+=1,ni===null&&(ni=[]),jd(ni,e,n)}function qt(e,n){n=n.props.ref,e.ref=n!==void 0?n:null}function so(e,n){throw n.$$typeof===ee?Error(c(525)):(e=Object.prototype.toString.call(n),Error(c(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)))}function Id(e){function n(h,f){if(e){var x=h.deletions;x===null?(h.deletions=[f],h.flags|=16):x.push(f)}}function t(h,f){if(!e)return null;for(;f!==null;)n(h,f),f=f.sibling;return null}function a(h){for(var f=new Map;h!==null;)h.key===null?f.set(h.index,h):f.set(h.key,h),h=h.sibling;return f}function i(h,f){return h=wt(h,f),h.index=0,h.sibling=null,h}function l(h,f,x){return h.index=x,e?(x=h.alternate,x!==null?(x=x.index,x<f?(h.flags|=2,f):x):(h.flags|=134217730,f)):(h.flags|=1048576,f)}function o(h){return e&&h.alternate===null&&(h.flags|=134217730),h}function s(h,f,x,C){return f===null||f.tag!==6?(f=Zr(x,h.mode,C),f.return=h,f):(f=i(f,x),f.return=h,f)}function u(h,f,x,C){var V=x.type;return V===Me?(h=T(h,f,x.props.children,C,x.key),qt(h,x),h):f!==null&&(f.elementType===V||typeof V=="object"&&V!==null&&V.$$typeof===pe&&Aa(V)===f.type)?(f=i(f,x.props),qt(f,x),f.return=h,f):(f=Wl(x.type,x.key,x.props,null,h.mode,C),qt(f,x),f.return=h,f)}function v(h,f,x,C){return f===null||f.tag!==4||f.stateNode.containerInfo!==x.containerInfo||f.stateNode.implementation!==x.implementation?(f=Qr(x,h.mode,C),f.return=h,f):(f=i(f,x.children||[]),f.return=h,f)}function T(h,f,x,C,V){return f===null||f.tag!==7?(f=ba(x,h.mode,C,V),f.return=h,f):(f=i(f,x),f.return=h,f)}function k(h,f,x){if(typeof f=="string"&&f!==""||typeof f=="number"||typeof f=="bigint")return f=Zr(""+f,h.mode,x),f.return=h,f;if(typeof f=="object"&&f!==null){switch(f.$$typeof){case J:return x=Wl(f.type,f.key,f.props,null,h.mode,x),qt(x,f),x.return=h,x;case Ee:return f=Qr(f,h.mode,x),f.return=h,f;case pe:return f=Aa(f),k(h,f,x)}if(U(f)||q(f))return f=ba(f,h.mode,x,null),f.return=h,f;if(typeof f.then=="function")return k(h,ro(f),x);if(f.$$typeof===de)return k(h,ao(h,f),x);so(h,f)}return null}function p(h,f,x,C){var V=f!==null?f.key:null;if(typeof x=="string"&&x!==""||typeof x=="number"||typeof x=="bigint")return V!==null?null:s(h,f,""+x,C);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case J:return x.key===V?u(h,f,x,C):null;case Ee:return x.key===V?v(h,f,x,C):null;case pe:return x=Aa(x),p(h,f,x,C)}if(U(x)||q(x))return V!==null?null:T(h,f,x,C,null);if(typeof x.then=="function")return p(h,f,ro(x),C);if(x.$$typeof===de)return p(h,f,ao(h,x),C);so(h,x)}return null}function w(h,f,x,C,V){if(typeof C=="string"&&C!==""||typeof C=="number"||typeof C=="bigint")return h=h.get(x)||null,s(f,h,""+C,V);if(typeof C=="object"&&C!==null){switch(C.$$typeof){case J:return h=h.get(C.key===null?x:C.key)||null,u(f,h,C,V);case Ee:return h=h.get(C.key===null?x:C.key)||null,v(f,h,C,V);case pe:return C=Aa(C),w(h,f,x,C,V)}if(U(C)||q(C))return h=h.get(x)||null,T(f,h,C,V,null);if(typeof C.then=="function")return w(h,f,x,ro(C),V);if(C.$$typeof===de)return w(h,f,x,ao(f,C),V);so(f,C)}return null}function I(h,f,x,C){for(var V=null,we=null,W=f,ne=f=0,We=null;W!==null&&ne<x.length;ne++){W.index>ne?(We=W,W=null):We=W.sibling;var Te=p(h,W,x[ne],C);if(Te===null){W===null&&(W=We);break}e&&W&&Te.alternate===null&&n(h,W),f=l(Te,f,ne),we===null?V=Te:we.sibling=Te,we=Te,W=We}if(ne===x.length)return t(h,W),fe&&St(h,ne),V;if(W===null){for(;ne<x.length;ne++)W=k(h,x[ne],C),W!==null&&(f=l(W,f,ne),we===null?V=W:we.sibling=W,we=W);return fe&&St(h,ne),V}for(W=a(W);ne<x.length;ne++)We=w(W,h,ne,x[ne],C),We!==null&&(e&&(Te=We.alternate,Te!==null&&W.delete(Te.key===null?ne:Te.key)),f=l(We,f,ne),we===null?V=We:we.sibling=We,we=We);return e&&W.forEach(function(oa){return n(h,oa)}),fe&&St(h,ne),V}function K(h,f,x,C){if(x==null)throw Error(c(151));for(var V=null,we=null,W=f,ne=f=0,We=null,Te=x.next();W!==null&&!Te.done;ne++,Te=x.next()){W.index>ne?(We=W,W=null):We=W.sibling;var oa=p(h,W,Te.value,C);if(oa===null){W===null&&(W=We);break}e&&W&&oa.alternate===null&&n(h,W),f=l(oa,f,ne),we===null?V=oa:we.sibling=oa,we=oa,W=We}if(Te.done)return t(h,W),fe&&St(h,ne),V;if(W===null){for(;!Te.done;ne++,Te=x.next())Te=k(h,Te.value,C),Te!==null&&(f=l(Te,f,ne),we===null?V=Te:we.sibling=Te,we=Te);return fe&&St(h,ne),V}for(W=a(W);!Te.done;ne++,Te=x.next())Te=w(W,h,ne,Te.value,C),Te!==null&&(e&&(We=Te.alternate,We!==null&&W.delete(We.key===null?ne:We.key)),f=l(Te,f,ne),we===null?V=Te:we.sibling=Te,we=Te);return e&&W.forEach(function(Wb){return n(h,Wb)}),fe&&St(h,ne),V}function se(h,f,x,C){if(typeof x=="object"&&x!==null&&x.type===Me&&x.key===null&&x.props.ref===void 0&&(x=x.props.children),typeof x=="object"&&x!==null){switch(x.$$typeof){case J:e:{for(var V=x.key;f!==null;){if(f.key===V){if(V=x.type,V===Me){if(f.tag===7){t(h,f.sibling),C=i(f,x.props.children),qt(C,x),C.return=h,h=C;break e}}else if(f.elementType===V||typeof V=="object"&&V!==null&&V.$$typeof===pe&&Aa(V)===f.type){t(h,f.sibling),C=i(f,x.props),qt(C,x),C.return=h,h=C;break e}t(h,f);break}else n(h,f);f=f.sibling}x.type===Me?(C=ba(x.props.children,h.mode,C,x.key),qt(C,x),C.return=h,h=C):(C=Wl(x.type,x.key,x.props,null,h.mode,C),qt(C,x),C.return=h,h=C)}return o(h);case Ee:e:{for(V=x.key;f!==null;){if(f.key===V)if(f.tag===4&&f.stateNode.containerInfo===x.containerInfo&&f.stateNode.implementation===x.implementation){t(h,f.sibling),C=i(f,x.children||[]),C.return=h,h=C;break e}else{t(h,f);break}else n(h,f);f=f.sibling}C=Qr(x,h.mode,C),C.return=h,h=C}return o(h);case pe:return x=Aa(x),se(h,f,x,C)}if(U(x))return I(h,f,x,C);if(q(x)){if(V=q(x),typeof V!="function")throw Error(c(150));return x=V.call(x),K(h,f,x,C)}if(typeof x.then=="function")return se(h,f,ro(x),C);if(x.$$typeof===de)return se(h,f,ao(h,x),C);so(h,x)}return typeof x=="string"&&x!==""||typeof x=="number"||typeof x=="bigint"?(x=""+x,f!==null&&f.tag===6?(t(h,f.sibling),C=i(f,x),C.return=h,h=C):(t(h,f),C=Zr(x,h.mode,C),C.return=h,h=C),o(h)):t(h,f)}return function(h,f,x,C){try{Fi=0;var V=se(h,f,x,C);return ni=null,V}catch(W){if(W===ei||W===lo)throw W;var we=yn(29,W,null,h.mode);return we.lanes=C,we.return=h,we}}}var Ca=Id(!0),_d=Id(!1),Gt=!1;function as(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function is(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Vt(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Yt(e,n,t){var a=e.updateQueue;if(a===null)return null;if(a=a.shared,(Ce&2)!==0){var i=a.pending;return i===null?n.next=n:(n.next=i.next,i.next=n),a.pending=n,n=$l(e),wd(e,null,t),n}return Jl(e,a,n,t),$l(e)}function Pi(e,n,t){if(n=n.updateQueue,n!==null&&(n=n.shared,(t&4194048)!==0)){var a=n.lanes;a&=e.pendingLanes,t|=a,n.lanes=t,Au(e,t)}}function ls(e,n){var t=e.updateQueue,a=e.alternate;if(a!==null&&(a=a.updateQueue,t===a)){var i=null,l=null;if(t=t.firstBaseUpdate,t!==null){do{var o={lane:t.lane,tag:t.tag,payload:t.payload,callback:null,next:null};l===null?i=l=o:l=l.next=o,t=t.next}while(t!==null);l===null?i=l=n:l=l.next=n}else i=l=n;t={baseState:a.baseState,firstBaseUpdate:i,lastBaseUpdate:l,shared:a.shared,callbacks:a.callbacks},e.updateQueue=t;return}e=t.lastBaseUpdate,e===null?t.firstBaseUpdate=n:e.next=n,t.lastBaseUpdate=n}var os=!1;function el(){if(os){var e=Pa;if(e!==null)throw e}}function nl(e,n,t,a){os=!1;var i=e.updateQueue;Gt=!1;var l=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var u=s,v=u.next;u.next=null,o===null?l=v:o.next=v,o=u;var T=e.alternate;T!==null&&(T=T.updateQueue,s=T.lastBaseUpdate,s!==o&&(s===null?T.firstBaseUpdate=v:s.next=v,T.lastBaseUpdate=u))}if(l!==null){var k=i.baseState;o=0,T=v=u=null,s=l;do{var p=s.lane&-536870913,w=p!==s.lane;if(w?(xe&p)===p:(a&p)===p){p!==0&&p===Ea&&(os=!0),T!==null&&(T=T.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});e:{var I=e,K=s;p=n;var se=t;switch(K.tag){case 1:if(I=K.payload,typeof I=="function"){k=I.call(se,k,p);break e}k=I;break e;case 3:I.flags=I.flags&-65537|128;case 0:if(I=K.payload,p=typeof I=="function"?I.call(se,k,p):I,p==null)break e;k=Y({},k,p);break e;case 2:Gt=!0}}p=s.callback,p!==null&&(e.flags|=64,w&&(e.flags|=8192),w=i.callbacks,w===null?i.callbacks=[p]:w.push(p))}else w={lane:p,tag:s.tag,payload:s.payload,callback:s.callback,next:null},T===null?(v=T=w,u=k):T=T.next=w,o|=p;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;w=s,s=w.next,w.next=null,i.lastBaseUpdate=w,i.shared.pending=null}}while(!0);T===null&&(u=k),i.baseState=u,i.firstBaseUpdate=v,i.lastBaseUpdate=T,l===null&&(i.shared.lanes=0),Wt|=o,e.lanes=o,e.memoizedState=k}}function Hd(e,n){if(typeof e!="function")throw Error(c(191,e));e.call(n)}function Ud(e,n){var t=e.callbacks;if(t!==null)for(e.callbacks=null,e=0;e<t.length;e++)Hd(t[e],n)}var Xt=Mn(null),co=Mn(0);function qd(e,n){e=Nt,Le(co,e),Le(Xt,n),Nt=e|n.baseLanes}function rs(){Le(co,Nt),Le(Xt,Xt.current)}function ss(){Nt=co.current,Ze(Xt),Ze(co)}var cn=Mn(null),mn=null;function Zt(e){var n=e.alternate;Le(un,un.current&1),Le(cn,e),mn===null&&(n===null||Xt.current!==null||n.memoizedState!==null)&&(mn=e)}function cs(e){Le(un,un.current),Le(cn,e),mn===null&&(mn=e)}function Gd(e){e.tag===22?(Le(un,un.current),Le(cn,e),mn===null&&(mn=e)):Qt()}function Qt(){Le(un,un.current),Le(cn,cn.current)}function Rn(e){Ze(cn),mn===e&&(mn=null),Ze(un)}var un=Mn(0);function tl(e,n){Le(cn,cn.current),Le(un,n)}function us(e){Ze(un),Ze(cn),mn===e&&(mn=null)}function uo(e){for(var n=e;n!==null;){if(n.tag===13){var t=n.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||Rc(t)||Oc(t)))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!=="independent"){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var At=0,re=null,De=null,Je=null,fo=!1,ti=!1,ka=!1,mo=0,al=0,ai=null,bv=0;function Ye(){throw Error(c(321))}function ds(e,n){if(n===null)return!1;for(var t=0;t<n.length&&t<e.length;t++)if(!zn(e[t],n[t]))return!1;return!0}function fs(e,n,t,a,i,l){return At=l,re=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,D.H=e===null||e.memoizedState===null?Mf:Cf,ka=!1,l=t(a,i),ka=!1,ti&&(l=Yd(n,t,a,i)),Vd(e),l}function Vd(e){D.H=xo;var n=De!==null&&De.next!==null;if(At=0,Je=De=re=null,fo=!1,al=0,ai=null,n)throw Error(c(300));e===null||$e||(e=e.dependencies,e!==null&&to(e)&&($e=!0))}function Yd(e,n,t,a){re=e;var i=0;do{if(ti&&(ai=null),al=0,ti=!1,25<=i)throw Error(c(301));if(i+=1,Je=De=null,e.updateQueue!=null){var l=e.updateQueue;l.lastEffect=null,l.events=null,l.stores=null,l.memoCache!=null&&(l.memoCache.index=0)}D.H=Mv,l=n(t,a)}while(ti);return l}function yv(){var e=D.H,n=e.useState()[0];return n=typeof n.then=="function"?il(n):n,e=e.useState()[0],(De!==null?De.memoizedState:null)!==e&&(re.flags|=1024),n}function ms(){var e=mo!==0;return mo=0,e}function ps(e,n,t){n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~t}function gs(e){if(fo){for(e=e.memoizedState;e!==null;){var n=e.queue;n!==null&&(n.pending=null),e=e.next}fo=!1}At=0,Je=De=re=null,ti=!1,al=mo=0,ai=null}function gn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Je===null?re.memoizedState=Je=e:Je=Je.next=e,Je}function Qe(){if(De===null){var e=re.alternate;e=e!==null?e.memoizedState:null}else e=De.next;var n=Je===null?re.memoizedState:Je.next;if(n!==null)Je=n,De=e;else{if(e===null)throw re.alternate===null?Error(c(467)):Error(c(310));De=e,e={memoizedState:De.memoizedState,baseState:De.baseState,baseQueue:De.baseQueue,queue:De.queue,next:null},Je===null?re.memoizedState=Je=e:Je=Je.next=e}return Je}function po(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function il(e){var n=al;return al+=1,ai===null&&(ai=[]),e=jd(ai,e,n),n=re,(Je===null?n.memoizedState:Je.next)===null&&(n=n.alternate,D.H=n===null||n.memoizedState===null?Mf:Cf),e}function go(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return il(e);if(e.$$typeof===z)return;if(e.$$typeof===de)return sn(e)}throw Error(c(438,String(e)))}function hs(e){var n=null,t=re.updateQueue;if(t!==null&&(n=t.memoCache),n==null){var a=re.alternate;a!==null&&(a=a.updateQueue,a!==null&&(a=a.memoCache,a!=null&&(n={data:a.data.map(function(i){return i.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),t===null&&(t=po(),re.updateQueue=t),t.memoCache=n,t=n.data[n.index],t===void 0)for(t=n.data[n.index]=Array(e),a=0;a<e;a++)t[a]=Tn;return n.index++,t}function Mt(e,n){return typeof n=="function"?n(e):n}function ho(e){var n=Qe();return vs(n,De,e)}function vs(e,n,t){var a=e.queue;if(a===null)throw Error(c(311));a.lastRenderedReducer=t;var i=e.baseQueue,l=a.pending;if(l!==null){if(i!==null){var o=i.next;i.next=l.next,l.next=o}n.baseQueue=i=l,a.pending=null}if(l=e.baseState,i===null)e.memoizedState=l;else{n=i.next;var s=o=null,u=null,v=n,T=!1;do{var k=v.lane&-536870913;if(k!==v.lane?(xe&k)===k:(At&k)===k){var p=v.revertLane;if(p===0)u!==null&&(u=u.next={lane:0,revertLane:0,gesture:null,action:v.action,hasEagerState:v.hasEagerState,eagerState:v.eagerState,next:null}),k===Ea&&(T=!0);else if((At&p)===p){v=v.next,p===Ea&&(T=!0);continue}else k={lane:0,revertLane:v.revertLane,gesture:null,action:v.action,hasEagerState:v.hasEagerState,eagerState:v.eagerState,next:null},u===null?(s=u=k,o=l):u=u.next=k,re.lanes|=p,Wt|=p;k=v.action,ka&&t(l,k),l=v.hasEagerState?v.eagerState:t(l,k)}else p={lane:k,revertLane:v.revertLane,gesture:v.gesture,action:v.action,hasEagerState:v.hasEagerState,eagerState:v.eagerState,next:null},u===null?(s=u=p,o=l):u=u.next=p,re.lanes|=k,Wt|=k;v=v.next}while(v!==null&&v!==n);if(u===null?o=l:u.next=s,!zn(l,e.memoizedState)&&($e=!0,T&&(t=Pa,t!==null)))throw t;e.memoizedState=l,e.baseState=o,e.baseQueue=u,a.lastRenderedState=l}return i===null&&(a.lanes=0),[e.memoizedState,a.dispatch]}function bs(e){var n=Qe(),t=n.queue;if(t===null)throw Error(c(311));t.lastRenderedReducer=e;var a=t.dispatch,i=t.pending,l=n.memoizedState;if(i!==null){t.pending=null;var o=i=i.next;do l=e(l,o.action),o=o.next;while(o!==i);zn(l,n.memoizedState)||($e=!0),n.memoizedState=l,n.baseQueue===null&&(n.baseState=l),t.lastRenderedState=l}return[l,a]}function Xd(e,n,t){var a=re,i=Qe(),l=fe;if(l){if(t===void 0)throw Error(c(407));t=t()}else t=n();var o=!zn((De||i).memoizedState,t);if(o&&(i.memoizedState=t,$e=!0),i=i.queue,ws(Kd.bind(null,a,i,e),[e]),e=i.getSnapshot!==n||o||Je!==null&&(Je.memoizedState.tag&1)!==0,ii(e?9:8,{destroy:void 0},Qd.bind(null,a,i,t,n),null),e){if(a.flags|=2048,Be===null)throw Error(c(349));l||(At&127)!==0||Zd(a,n,t)}return t}function Zd(e,n,t){e.flags|=16384,e={getSnapshot:n,value:t},n=re.updateQueue,n===null?(n=po(),re.updateQueue=n,n.stores=[e]):(t=n.stores,t===null?n.stores=[e]:t.push(e))}function Qd(e,n,t,a){n.value=t,n.getSnapshot=a,Jd(n)&&$d(e)}function Kd(e,n,t){return t(function(){Jd(n)&&$d(e)})}function Jd(e){var n=e.getSnapshot;e=e.value;try{var t=n();return!zn(e,t)}catch{return!0}}function $d(e){var n=va(e,2);n!==null&&En(n,e,2)}function ys(e){var n=gn();if(typeof e=="function"){var t=e;if(e=t(),ka){jt(!0);try{t()}finally{jt(!1)}}}return n.memoizedState=n.baseState=e,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Mt,lastRenderedState:e},n}function Wd(e,n,t,a){return e.baseState=t,vs(e,De,typeof a=="function"?a:Mt)}function xv(e,n,t,a,i){if(yo(e))throw Error(c(485));if(e=n.action,e!==null){var l={payload:i,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(o){l.listeners.push(o)}};D.T!==null?t(!0):l.isTransition=!1,a(l),t=n.pending,t===null?(l.next=n.pending=l,Fd(n,l)):(l.next=t.next,n.pending=t.next=l)}}function Fd(e,n){var t=n.action,a=n.payload,i=e.state;if(n.isTransition){var l=D.T,o={};o.types=l!==null?l.types:null,D.T=o;try{var s=t(i,a),u=D.S;u!==null&&u(o,s),Pd(e,n,s)}catch(v){xs(e,n,v)}finally{l!==null&&o.types!==null&&(l.types=o.types),D.T=l}}else try{l=t(i,a),Pd(e,n,l)}catch(v){xs(e,n,v)}}function Pd(e,n,t){t!==null&&typeof t=="object"&&typeof t.then=="function"?t.then(function(a){ef(e,n,a)},function(a){return xs(e,n,a)}):ef(e,n,t)}function ef(e,n,t){n.status="fulfilled",n.value=t,nf(n),e.state=t,n=e.pending,n!==null&&(t=n.next,t===n?e.pending=null:(t=t.next,n.next=t,Fd(e,t)))}function xs(e,n,t){var a=e.pending;if(e.pending=null,a!==null){a=a.next;do n.status="rejected",n.reason=t,nf(n),n=n.next;while(n!==a)}e.action=null}function nf(e){e=e.listeners;for(var n=0;n<e.length;n++)(0,e[n])()}function tf(e,n){return n}function af(e,n){if(fe){var t=Be.formState;if(t!==null){e:{var a=re;if(fe){if(Ie){n:{for(var i=Ie,l=Yn;i.nodeType!==8;){if(!l){i=null;break n}if(i=Zn(i.nextSibling),i===null){i=null;break n}}l=i.data,i=l==="F!"||l==="F"?i:null}if(i){Ie=Zn(i.nextSibling),a=i.data==="F!";break e}}Ht(a)}a=!1}a&&(n=t[0])}}return t=gn(),t.memoizedState=t.baseState=n,a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:tf,lastRenderedState:n},t.queue=a,t=Ef.bind(null,re,a),a.dispatch=t,a=ys(!1),l=Ms.bind(null,re,!1,a.queue),a=gn(),i={state:n,dispatch:null,action:e,pending:null},a.queue=i,t=xv.bind(null,re,i,l,t),i.dispatch=t,a.memoizedState=e,[n,t,!1]}function lf(e){var n=Qe();return of(n,De,e)}function of(e,n,t){if(n=vs(e,n,tf)[0],e=ho(Mt)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var a=il(n)}catch(o){throw o===ei?lo:o}else a=n;n=Qe();var i=n.queue,l=i.dispatch;return t!==n.memoizedState&&(re.flags|=2048,ii(9,{destroy:void 0},wv.bind(null,i,t),null)),[a,l,e]}function wv(e,n){e.action=n}function rf(e){var n=Qe(),t=De;if(t!==null)return of(n,t,e);Qe(),n=n.memoizedState,t=Qe();var a=t.queue.dispatch;return t.memoizedState=e,[n,a,!1]}function ii(e,n,t,a){return e={tag:e,create:t,deps:a,inst:n,next:null},n=re.updateQueue,n===null&&(n=po(),re.updateQueue=n),t=n.lastEffect,t===null?n.lastEffect=e.next=e:(a=t.next,t.next=e,e.next=a,n.lastEffect=e),e}function sf(){return Qe().memoizedState}function vo(e,n,t,a){var i=gn();re.flags|=e,i.memoizedState=ii(1|n,{destroy:void 0},t,a===void 0?null:a)}function bo(e,n,t,a){var i=Qe();a=a===void 0?null:a;var l=i.memoizedState.inst;De!==null&&a!==null&&ds(a,De.memoizedState.deps)?i.memoizedState=ii(n,l,t,a):(re.flags|=e,i.memoizedState=ii(1|n,l,t,a))}function cf(e,n){vo(8390656,8,e,n)}function ws(e,n){bo(2048,8,e,n)}function Sv(e){re.flags|=4;var n=re.updateQueue;if(n===null)n=po(),re.updateQueue=n,n.events=[e];else{var t=n.events;t===null?n.events=[e]:t.push(e)}}function uf(e){var n=Qe().memoizedState;return Sv({ref:n,nextImpl:e}),function(){if((Ce&2)!==0)throw Error(c(440));return n.impl.apply(void 0,arguments)}}function df(e,n){return bo(4,2,e,n)}function ff(e,n){return bo(4,4,e,n)}function mf(e,n){if(typeof n=="function"){e=e();var t=n(e);return function(){typeof t=="function"?t():n(null)}}if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function pf(e,n,t){t=t!=null?t.concat([e]):null,bo(4,4,mf.bind(null,n,e),t)}function Ss(){}function gf(e,n){var t=Qe();n=n===void 0?null:n;var a=t.memoizedState;return n!==null&&ds(n,a[1])?a[0]:(t.memoizedState=[e,n],e)}function hf(e,n){var t=Qe();n=n===void 0?null:n;var a=t.memoizedState;if(n!==null&&ds(n,a[1]))return a[0];if(a=e(),ka){jt(!0);try{e()}finally{jt(!1)}}return t.memoizedState=[a,n],a}function Es(e,n,t){return t===void 0||(At&1073741824)!==0&&(xe&261930)===0?e.memoizedState=n:(e.memoizedState=t,e=Mm(),re.lanes|=e,Wt|=e,t)}function vf(e,n,t,a){return zn(t,n)?t:Xt.current!==null?(e=Es(e,t,a),zn(e,n)||($e=!0),e):(At&106)===0||(At&1073741824)!==0&&(xe&261930)===0?($e=!0,e.memoizedState=t):(e=Mm(),re.lanes|=e,Wt|=e,n)}function bf(e,n,t,a,i){var l=P.p;P.p=l!==0&&8>l?l:8;var o=D.T,s={};s.types=o!==null?o.types:null,D.T=s,Ms(e,!1,n,t);try{var u=i(),v=D.S;if(v!==null&&v(s,u),u!==null&&typeof u=="object"&&typeof u.then=="function"){var T=vv(u,a);ll(e,n,T,Bn(e))}else ll(e,n,a,Bn(e))}catch(k){ll(e,n,{then:function(){},status:"rejected",reason:k},Bn())}finally{P.p=l,o!==null&&s.types!==null&&(o.types=s.types),D.T=o}}function Ev(){}function Ts(e,n,t,a){if(e.tag!==5)throw Error(c(476));var i=yf(e).queue;bf(e,i,n,Kn,t===null?Ev:function(){return xf(e),t(a)})}function yf(e){var n=e.memoizedState;if(n!==null)return n;n={memoizedState:Kn,baseState:Kn,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Mt,lastRenderedState:Kn},next:null};var t={};return n.next={memoizedState:t,baseState:t,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Mt,lastRenderedState:t},next:null},e.memoizedState=n,e=e.alternate,e!==null&&(e.memoizedState=n),n}function xf(e){var n=yf(e);n.next===null&&(n=e.alternate.memoizedState),ll(e,n.next.queue,{},Bn())}function As(){return sn(Ei)}function wf(){return Qe().memoizedState}function Sf(){return Qe().memoizedState}function Tv(e){for(var n=e.return;n!==null;){switch(n.tag){case 24:case 3:var t=Bn();e=Vt(t);var a=Yt(n,e,t);a!==null&&(En(a,n,t),Pi(a,n,t)),n={cache:Pr()},e.payload=n;return}n=n.return}}function Av(e,n,t){var a=Bn();t={lane:a,revertLane:0,gesture:null,action:t,hasEagerState:!1,eagerState:null,next:null},yo(e)?Tf(n,t):(t=Yr(e,n,t,a),t!==null&&(En(t,e,a),Af(t,n,a)))}function Ef(e,n,t){var a=Bn();ll(e,n,t,a)}function ll(e,n,t,a){var i={lane:a,revertLane:0,gesture:null,action:t,hasEagerState:!1,eagerState:null,next:null};if(yo(e))Tf(n,i);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=n.lastRenderedReducer,l!==null))try{var o=n.lastRenderedState,s=l(o,t);if(i.hasEagerState=!0,i.eagerState=s,zn(s,o))return Jl(e,n,i,0),Be===null&&Kl(),!1}catch{}if(t=Yr(e,n,i,a),t!==null)return En(t,e,a),Af(t,n,a),!0}return!1}function Ms(e,n,t,a){if(a={lane:2,revertLane:hc(),gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},yo(e)){if(n)throw Error(c(479))}else n=Yr(e,t,a,2),n!==null&&En(n,e,2)}function yo(e){var n=e.alternate;return e===re||n!==null&&n===re}function Tf(e,n){ti=fo=!0;var t=e.pending;t===null?n.next=n:(n.next=t.next,t.next=n),e.pending=n}function Af(e,n,t){if((t&4194048)!==0){var a=n.lanes;a&=e.pendingLanes,t|=a,n.lanes=t,Au(e,t)}}var xo={readContext:sn,use:go,useCallback:Ye,useContext:Ye,useEffect:Ye,useImperativeHandle:Ye,useLayoutEffect:Ye,useInsertionEffect:Ye,useMemo:Ye,useReducer:Ye,useRef:Ye,useState:Ye,useDebugValue:Ye,useDeferredValue:Ye,useTransition:Ye,useSyncExternalStore:Ye,useId:Ye,useHostTransitionStatus:Ye,useFormState:Ye,useActionState:Ye,useOptimistic:Ye,useMemoCache:Ye,useCacheRefresh:Ye,useEffectEvent:Ye},Mf={readContext:sn,use:go,useCallback:function(e,n){return gn().memoizedState=[e,n===void 0?null:n],e},useContext:sn,useEffect:cf,useImperativeHandle:function(e,n,t){t=t!=null?t.concat([e]):null,vo(4194308,4,mf.bind(null,n,e),t)},useLayoutEffect:function(e,n){return vo(4194308,4,e,n)},useInsertionEffect:function(e,n){vo(4,2,e,n)},useMemo:function(e,n){var t=gn();n=n===void 0?null:n;var a=e();if(ka){jt(!0);try{e()}finally{jt(!1)}}return t.memoizedState=[a,n],a},useReducer:function(e,n,t){var a=gn();if(t!==void 0){var i=t(n);if(ka){jt(!0);try{t(n)}finally{jt(!1)}}}else i=n;return a.memoizedState=a.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},a.queue=e,e=e.dispatch=Av.bind(null,re,e),[a.memoizedState,e]},useRef:function(e){var n=gn();return e={current:e},n.memoizedState=e},useState:function(e){e=ys(e);var n=e.queue,t=Ef.bind(null,re,n);return n.dispatch=t,[e.memoizedState,t]},useDebugValue:Ss,useDeferredValue:function(e,n){var t=gn();return Es(t,e,n)},useTransition:function(){var e=ys(!1);return e=bf.bind(null,re,e.queue,!0,!1),gn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,n,t){var a=re,i=gn();if(fe){if(t===void 0)throw Error(c(407));t=t()}else{if(t=n(),Be===null)throw Error(c(349));(xe&127)!==0||Zd(a,n,t)}i.memoizedState=t;var l={value:t,getSnapshot:n};return i.queue=l,cf(Kd.bind(null,a,l,e),[e]),a.flags|=2048,ii(9,{destroy:void 0},Qd.bind(null,a,l,t,n),null),t},useId:function(){var e=gn(),n=Be.identifierPrefix;if(fe){var t=rt,a=ot;t=(a&~(1<<32-Nn(a)-1)).toString(32)+t,n="_"+n+"R_"+t,t=mo++,0<t&&(n+="H"+t.toString(32)),n+="_"}else t=bv++,n="_"+n+"r_"+t.toString(32)+"_";return e.memoizedState=n},useHostTransitionStatus:As,useFormState:af,useActionState:af,useOptimistic:function(e){var n=gn();n.memoizedState=n.baseState=e;var t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=t,n=Ms.bind(null,re,!0,t),t.dispatch=n,[e,n]},useMemoCache:hs,useCacheRefresh:function(){return gn().memoizedState=Tv.bind(null,re)},useEffectEvent:function(e){var n=gn(),t={impl:e};return n.memoizedState=t,function(){if((Ce&2)!==0)throw Error(c(440));return t.impl.apply(void 0,arguments)}}},Cf={readContext:sn,use:go,useCallback:gf,useContext:sn,useEffect:ws,useImperativeHandle:pf,useInsertionEffect:df,useLayoutEffect:ff,useMemo:hf,useReducer:ho,useRef:sf,useState:function(){return ho(Mt)},useDebugValue:Ss,useDeferredValue:function(e,n){var t=Qe();return vf(t,De.memoizedState,e,n)},useTransition:function(){var e=ho(Mt)[0],n=Qe().memoizedState;return[typeof e=="boolean"?e:il(e),n]},useSyncExternalStore:Xd,useId:wf,useHostTransitionStatus:As,useFormState:lf,useActionState:lf,useOptimistic:function(e,n){var t=Qe();return Wd(t,De,e,n)},useMemoCache:hs,useCacheRefresh:Sf,useEffectEvent:uf},Mv={readContext:sn,use:go,useCallback:gf,useContext:sn,useEffect:ws,useImperativeHandle:pf,useInsertionEffect:df,useLayoutEffect:ff,useMemo:hf,useReducer:bs,useRef:sf,useState:function(){return bs(Mt)},useDebugValue:Ss,useDeferredValue:function(e,n){var t=Qe();return De===null?Es(t,e,n):vf(t,De.memoizedState,e,n)},useTransition:function(){var e=bs(Mt)[0],n=Qe().memoizedState;return[typeof e=="boolean"?e:il(e),n]},useSyncExternalStore:Xd,useId:wf,useHostTransitionStatus:As,useFormState:rf,useActionState:rf,useOptimistic:function(e,n){var t=Qe();return De!==null?Wd(t,De,e,n):(t.baseState=e,[e,t.queue.dispatch])},useMemoCache:hs,useCacheRefresh:Sf,useEffectEvent:uf};function Cs(e,n,t,a){n=e.memoizedState,t=t(a,n),t=t==null?n:Y({},n,t),e.memoizedState=t,e.lanes===0&&(e.updateQueue.baseState=t)}var ks={enqueueSetState:function(e,n,t){e=e._reactInternals;var a=Bn(),i=Vt(a);i.payload=n,t!=null&&(i.callback=t),n=Yt(e,i,a),n!==null&&(En(n,e,a),Pi(n,e,a))},enqueueReplaceState:function(e,n,t){e=e._reactInternals;var a=Bn(),i=Vt(a);i.tag=1,i.payload=n,t!=null&&(i.callback=t),n=Yt(e,i,a),n!==null&&(En(n,e,a),Pi(n,e,a))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var t=Bn(),a=Vt(t);a.tag=2,n!=null&&(a.callback=n),n=Yt(e,a,t),n!==null&&(En(n,e,t),Pi(n,e,t))}};function kf(e,n,t,a,i,l,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(a,l,o):n.prototype&&n.prototype.isPureReactComponent?!Xi(t,a)||!Xi(i,l):!0}function Nf(e,n,t,a){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(t,a),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(t,a),n.state!==e&&ks.enqueueReplaceState(n,n.state,null)}function Na(e,n){var t=n;if("ref"in n){t={};for(var a in n)a!=="ref"&&(t[a]=n[a])}if(e=e.defaultProps){t===n&&(t=Y({},t));for(var i in e)t[i]===void 0&&(t[i]=e[i])}return t}function Lf(e){Ql(e)}function zf(e){console.error(e)}function Rf(e){Ql(e)}function wo(e,n){try{var t=e.onUncaughtError;t(n.value,{componentStack:n.stack})}catch(a){setTimeout(function(){throw a})}}function Of(e,n,t){try{var a=e.onCaughtError;a(t.value,{componentStack:t.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(i){setTimeout(function(){throw i})}}function Ns(e,n,t){return t=Vt(t),t.tag=3,t.payload={element:null},t.callback=function(){wo(e,n)},t}function jf(e){return e=Vt(e),e.tag=3,e}function Df(e,n,t,a){var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var l=a.value;e.payload=function(){return i(l)},e.callback=function(){Of(n,t,a)}}var o=t.stateNode;o!==null&&typeof o.componentDidCatch=="function"&&(e.callback=function(){Of(n,t,a),typeof i!="function"&&(Ft===null?Ft=new Set([this]):Ft.add(this));var s=a.stack;this.componentDidCatch(a.value,{componentStack:s!==null?s:""})})}function Cv(e,n,t,a,i){if(t.flags|=32768,a!==null&&typeof a=="object"&&typeof a.then=="function"){if(n=t.alternate,n!==null&&wa(n,t,i,!0),t=cn.current,t!==null){switch(t.tag){case 31:case 13:case 19:return mn===null?Go():t.alternate===null&&Xe===0&&(Xe=3),t.flags&=-257,t.flags|=65536,t.lanes=i,a===oo?t.flags|=16384:(n=t.updateQueue,n===null?t.updateQueue=new Set([a]):n.add(a),mc(e,a,i)),!1;case 22:return t.flags|=65536,a===oo?t.flags|=16384:(n=t.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([a])},t.updateQueue=n):(t=n.retryQueue,t===null?n.retryQueue=new Set([a]):t.add(a)),mc(e,a,i)),!1}throw Error(c(435,t.tag))}return mc(e,a,i),Go(),!1}if(fe)return n=cn.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=i,a!==Jr&&(e=Error(c(422),{cause:a}),Ki(qn(e,t)))):(a!==Jr&&(n=Error(c(423),{cause:a}),Ki(qn(n,t))),e=e.current.alternate,e.flags|=65536,i&=-i,e.lanes|=i,a=qn(a,t),i=Ns(e.stateNode,a,i),ls(e,i),Xe!==4&&(Xe=2)),!1;var l=Error(c(520),{cause:a});if(l=qn(l,t),ml===null?ml=[l]:ml.push(l),Xe!==4&&(Xe=2),n===null)return!0;a=qn(a,t),t=n;do{switch(t.tag){case 3:return t.flags|=65536,e=i&-i,t.lanes|=e,e=Ns(t.stateNode,a,e),ls(t,e),!1;case 1:if(n=t.type,l=t.stateNode,(t.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||l!==null&&typeof l.componentDidCatch=="function"&&(Ft===null||!Ft.has(l))))return t.flags|=65536,i&=-i,t.lanes|=i,i=jf(i),Df(i,e,t,a),ls(t,i),!1;break;case 22:if(t.memoizedState!==null)return t.flags|=65536,!1}t=t.return}while(t!==null);return!1}var Ls=Error(c(461)),$e=!1;function Pe(e,n,t,a){n.child=e===null?_d(n,null,t,a):Ca(n,e.child,t,a)}function Bf(e,n,t,a,i){t=t.render;var l=n.ref;if("ref"in a){var o={};for(var s in a)s!=="ref"&&(o[s]=a[s])}else o=a;return Sa(n),a=fs(e,n,t,o,l,i),s=ms(),e!==null&&!$e?(ps(e,n,i),Ct(e,n,i)):(fe&&s&&Pl(n),n.flags|=1,Pe(e,n,a,i),n.child)}function If(e,n,t,a,i){if(e===null){var l=t.type;return typeof l=="function"&&!Xr(l)&&l.defaultProps===void 0&&t.compare===null?(n.tag=15,n.type=l,_f(e,n,l,a,i)):(e=Wl(t.type,null,a,n,n.mode,i),e.ref=n.ref,e.return=n,n.child=e)}if(l=e.child,!_s(e,i)){var o=l.memoizedProps;if(t=t.compare,t=t!==null?t:Xi,t(o,a)&&e.ref===n.ref)return Ct(e,n,i)}return n.flags|=1,e=wt(l,a),e.ref=n.ref,e.return=n,n.child=e}function _f(e,n,t,a,i){if(e!==null){var l=e.memoizedProps;if(Xi(l,a)&&e.ref===n.ref)if($e=!1,n.pendingProps=a=l,_s(e,i))(e.flags&131072)!==0&&($e=!0);else return n.lanes=e.lanes,Ct(e,n,i)}return zs(e,n,t,a,i)}function Hf(e,n,t,a){var i=a.children,l=e!==null?e.memoizedState:null;if(e===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),a.mode==="hidden"){if((n.flags&128)!==0){if(l=l!==null?l.baseLanes|t:t,e!==null){for(a=n.child=e.child,i=0;a!==null;)i=i|a.lanes|a.childLanes,a=a.sibling;a=i&~l}else a=0,n.child=null;return Uf(e,n,l,t,a)}if((t&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},e!==null&&io(n,l!==null?l.cachePool:null),l!==null?qd(n,l):rs(),Gd(n);else return a=n.lanes=536870912,Uf(e,n,l!==null?l.baseLanes|t:t,t,a)}else l!==null?(io(n,l.cachePool),qd(n,l),Qt(),n.memoizedState=null):(e!==null&&io(n,null),rs(),Qt());return Pe(e,n,i,t),n.child}function ol(e,n){return e!==null&&e.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function Uf(e,n,t,a,i){var l=ns();return l=l===null?null:{parent:Ke._currentValue,pool:l},n.memoizedState={baseLanes:t,cachePool:l},e!==null&&io(n,null),rs(),Gd(n),e!==null&&wa(e,n,a,!0),n.childLanes=i,null}function So(e,n){return n=Eo({mode:n.mode,children:n.children},e.mode),n.ref=e.ref,e.child=n,n.return=e,n}function qf(e,n,t){return Ca(n,e.child,null,t),e=So(n,n.pendingProps),e.flags|=2,Rn(n),n.memoizedState=null,e}function kv(e,n,t){var a=n.pendingProps,i=(n.flags&128)!==0;if(n.flags&=-129,e===null){if(fe){if(a.mode==="hidden")return e=So(n,a),n.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},ol(null,e);if(cs(n),(e=Ie)?(e=mp(e,Yn),e=e!==null&&e.data==="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:It!==null?{id:ot,overflow:rt}:null,retryLane:536870912,hydrationErrors:null},t=Ed(e),t.return=n,n.child=t,tn=n,Ie=null)):e=null,e===null)throw Ht(n);return n.lanes=536870912,null}return So(n,a)}var l=e.memoizedState;if(l!==null){var o=l.dehydrated;if(cs(n),i)if(n.flags&256)n.flags&=-257,n=qf(e,n,t);else if(n.memoizedState!==null)n.child=e.child,n.flags|=128,n=null;else throw Error(c(558));else if($e||wa(e,n,t,!1),i=(t&e.childLanes)!==0,$e||i){if(Xt.current===null){if(a=Be,a!==null&&(o=Mu(a,t),o!==0&&o!==l.retryLane))throw l.retryLane=o,va(e,o),En(a,e,o),Ls;Go()}n=qf(e,n,t)}else e=l.treeContext,Ie=Zn(o.nextSibling),tn=n,fe=!0,_t=null,Yn=!1,e!==null&&Md(n,e),n=So(n,a),n.flags|=134221824;return n}return e=wt(e.child,{mode:a.mode,children:a.children}),e.ref=n.ref,n.child=e,e.return=n,e}function li(e,n){var t=n.ref;if(t===null)e!==null&&e.ref!==null&&(n.flags|=4194816);else{if(typeof t!="function"&&typeof t!="object")throw Error(c(284));(e===null||e.ref!==t)&&(n.flags|=4194816)}}function zs(e,n,t,a,i){return Sa(n),t=fs(e,n,t,a,void 0,i),a=ms(),e!==null&&!$e?(ps(e,n,i),Ct(e,n,i)):(fe&&a&&Pl(n),n.flags|=1,Pe(e,n,t,i),n.child)}function Gf(e,n,t,a,i,l){return Sa(n),n.updateQueue=null,t=Yd(n,a,t,i),Vd(e),a=ms(),e!==null&&!$e?(ps(e,n,l),Ct(e,n,l)):(fe&&a&&Pl(n),n.flags|=1,Pe(e,n,t,l),n.child)}function Vf(e,n,t,a,i){if(Sa(n),n.stateNode===null){var l=Ja,o=t.contextType;typeof o=="object"&&o!==null&&(l=sn(o)),l=new t(a,l),n.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,l.updater=ks,n.stateNode=l,l._reactInternals=n,l=n.stateNode,l.props=a,l.state=n.memoizedState,l.refs={},as(n),o=t.contextType,l.context=typeof o=="object"&&o!==null?sn(o):Ja,l.state=n.memoizedState,o=t.getDerivedStateFromProps,typeof o=="function"&&(Cs(n,t,o,a),l.state=n.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(o=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),o!==l.state&&ks.enqueueReplaceState(l,l.state,null),nl(n,a,l,i),el(),l.state=n.memoizedState),typeof l.componentDidMount=="function"&&(n.flags|=4194308),a=!0}else if(e===null){l=n.stateNode;var s=n.memoizedProps,u=Na(t,s);l.props=u;var v=l.context,T=t.contextType;o=Ja,typeof T=="object"&&T!==null&&(o=sn(T));var k=t.getDerivedStateFromProps;T=typeof k=="function"||typeof l.getSnapshotBeforeUpdate=="function",s=n.pendingProps!==s,T||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(s||v!==o)&&Nf(n,l,a,o),Gt=!1;var p=n.memoizedState;l.state=p,nl(n,a,l,i),el(),v=n.memoizedState,s||p!==v||Gt?(typeof k=="function"&&(Cs(n,t,k,a),v=n.memoizedState),(u=Gt||kf(n,t,u,a,p,v,o))?(T||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount()),typeof l.componentDidMount=="function"&&(n.flags|=4194308)):(typeof l.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=a,n.memoizedState=v),l.props=a,l.state=v,l.context=o,a=u):(typeof l.componentDidMount=="function"&&(n.flags|=4194308),a=!1)}else{l=n.stateNode,is(e,n),o=n.memoizedProps,T=Na(t,o),l.props=T,k=n.pendingProps,p=l.context,v=t.contextType,u=Ja,typeof v=="object"&&v!==null&&(u=sn(v)),s=t.getDerivedStateFromProps,(v=typeof s=="function"||typeof l.getSnapshotBeforeUpdate=="function")||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(o!==k||p!==u)&&Nf(n,l,a,u),Gt=!1,p=n.memoizedState,l.state=p,nl(n,a,l,i),el();var w=n.memoizedState;o!==k||p!==w||Gt||e!==null&&e.dependencies!==null&&to(e.dependencies)?(typeof s=="function"&&(Cs(n,t,s,a),w=n.memoizedState),(T=Gt||kf(n,t,T,a,p,w,u)||e!==null&&e.dependencies!==null&&to(e.dependencies))?(v||typeof l.UNSAFE_componentWillUpdate!="function"&&typeof l.componentWillUpdate!="function"||(typeof l.componentWillUpdate=="function"&&l.componentWillUpdate(a,w,u),typeof l.UNSAFE_componentWillUpdate=="function"&&l.UNSAFE_componentWillUpdate(a,w,u)),typeof l.componentDidUpdate=="function"&&(n.flags|=4),typeof l.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof l.componentDidUpdate!="function"||o===e.memoizedProps&&p===e.memoizedState||(n.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||o===e.memoizedProps&&p===e.memoizedState||(n.flags|=1024),n.memoizedProps=a,n.memoizedState=w),l.props=a,l.state=w,l.context=u,a=T):(typeof l.componentDidUpdate!="function"||o===e.memoizedProps&&p===e.memoizedState||(n.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||o===e.memoizedProps&&p===e.memoizedState||(n.flags|=1024),a=!1)}return l=a,li(e,n),a=(n.flags&128)!==0,l||a?(l=n.stateNode,t=a&&typeof t.getDerivedStateFromError!="function"?null:l.render(),n.flags|=1,e!==null&&a?(n.child=Ca(n,e.child,null,i),n.child=Ca(n,null,t,i)):Pe(e,n,t,i),n.memoizedState=l.state,e=n.child):e=Ct(e,n,i),e}function Yf(e,n,t,a){return ya(),n.flags|=256,Pe(e,n,t,a),n.child}var Rs={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Os(e){return{baseLanes:e,cachePool:Rd()}}function js(e,n,t){return e=e!==null?e.childLanes&~t:0,n&&(e|=Dn),e}function Xf(e,n,t){var a=n.pendingProps,i=!1,l=(n.flags&128)!==0,o;if((o=l)||(o=e!==null&&e.memoizedState===null?!1:(un.current&2)!==0),o&&(i=!0,n.flags&=-129),o=(n.flags&32)!==0,n.flags&=-33,e===null){if(fe){if(i?Zt(n):Qt(),(e=Ie)?(e=mp(e,Yn),e=e!==null&&e.data!=="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:It!==null?{id:ot,overflow:rt}:null,retryLane:536870912,hydrationErrors:null},t=Ed(e),t.return=n,n.child=t,tn=n,Ie=null)):e=null,e===null)throw Ht(n);return Oc(e)?n.lanes=32:n.lanes=536870912,null}return l=a.children,a=a.fallback,i?(Qt(),i=n.mode,l=Eo({mode:"hidden",children:l},i),a=ba(a,i,t,null),l.return=n,a.return=n,l.sibling=a,n.child=l,a=n.child,a.memoizedState=Os(t),a.childLanes=js(e,o,t),n.memoizedState=Rs,ol(null,a)):(Zt(n),Ds(n,l))}var s=e.memoizedState;if(s!==null){var u=s.dehydrated;if(u!==null)return Nv(e,n,l,o,a,u,s,t)}return i?(Qt(),i=a.fallback,l=n.mode,s=e.child,u=s.sibling,a=wt(s,{mode:"hidden",children:a.children}),a.subtreeFlags=s.subtreeFlags&1206910976,u!==null?i=wt(u,i):(i=ba(i,l,t,null),i.flags|=2),i.return=n,a.return=n,a.sibling=i,n.child=a,ol(null,a),a=n.child,i=e.child.memoizedState,i===null?i=Os(t):(l=i.cachePool,l!==null?(s=Ke._currentValue,l=l.parent!==s?{parent:s,pool:s}:l):l=Rd(),i={baseLanes:i.baseLanes|t,cachePool:l}),a.memoizedState=i,a.childLanes=js(e,o,t),n.memoizedState=Rs,ol(e.child,a)):(Zt(n),t=e.child,e=t.sibling,t=wt(t,{mode:"visible",children:a.children}),t.return=n,t.sibling=null,e!==null&&(o=n.deletions,o===null?(n.deletions=[e],n.flags|=16):o.push(e)),n.child=t,n.memoizedState=null,t)}function Ds(e,n){return n=Eo({mode:"visible",children:n},e.mode),n.return=e,e.child=n}function Eo(e,n){return e=yn(22,e,null,n),e.lanes=0,e}function To(e,n,t){return Ca(n,e.child,null,t),e=Ds(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function Nv(e,n,t,a,i,l,o,s){if(t)return n.flags&256?(Zt(n),n.flags&=-257,To(e,n,s)):n.memoizedState!==null?(Qt(),n.child=e.child,n.flags|=128,null):(Qt(),l=i.fallback,o=n.mode,i=Eo({mode:"visible",children:i.children},o),l=ba(l,o,s,null),l.flags|=2,i.return=n,l.return=n,i.sibling=l,n.child=i,Ca(n,e.child,null,s),i=n.child,i.memoizedState=Os(s),i.childLanes=js(e,a,s),n.memoizedState=Rs,ol(null,i));if(Zt(n),Oc(l)){if(a=l.nextSibling&&l.nextSibling.dataset,a)var u=a.dgst;return a=u,a!==""&&(i=Error(c(419)),i.stack="",i.digest=a,Ki({value:i,source:null,stack:null})),To(e,n,s)}if($e||wa(e,n,s,!1),a=(s&e.childLanes)!==0,$e||a){if(Xt.current!==null)return To(e,n,s);if(a=Be,a!==null&&(i=Mu(a,s),i!==0&&i!==o.retryLane))throw o.retryLane=i,va(e,i),En(a,e,i),Ls;return Rc(l)||Go(),To(e,n,s)}return Rc(l)?(n.flags|=192,n.child=e.child,null):(e=o.treeContext,Ie=Zn(l.nextSibling),tn=n,fe=!0,_t=null,Yn=!1,e!==null&&Md(n,e),n=Ds(n,i.children),n.flags|=134221824,n)}function Zf(e,n,t){e.lanes|=n;var a=e.alternate;a!==null&&(a.lanes|=n),no(e.return,n,t)}function Qf(e){for(var n=null;e!==null;){var t=e.alternate;t!==null&&uo(t)===null&&(n=e),e=e.sibling}return n}function Ao(e,n,t,a,i,l){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:a,tail:t,tailMode:i,treeForkCount:l}:(o.isBackwards=n,o.rendering=null,o.renderingStartTime=0,o.last=a,o.tail=t,o.tailMode=i,o.treeForkCount=l)}function Bs(e){var n=e.child;for(e.child=null;n!==null;){var t=n.sibling;n.sibling=e.child,e.child=n,n=t}}function Is(e,n,t){var a=n.pendingProps,i=a.revealOrder,l=a.tail;a=a.children;var o=un.current;if(n.flags&128)return tl(n,o),null;var s=(o&2)!==0;if(s?(o=o&1|2,n.flags|=128):o&=1,tl(n,o),i==="backwards"&&e!==null?(Bs(e),Pe(e,n,a,t),Bs(e)):Pe(e,n,a,t),a=fe?Qi:0,!s&&e!==null&&(e.flags&128)!==0)e:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Zf(e,t,n);else if(e.tag===19)Zf(e,t,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break e;for(;e.sibling===null;){if(e.return===null||e.return===n)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case"backwards":t=Qf(n.child),t===null?(i=n.child,n.child=null):(i=t.sibling,t.sibling=null,Bs(n)),Ao(n,!0,i,null,l,a);break;case"unstable_legacy-backwards":for(t=null,i=n.child,n.child=null;i!==null;){if(e=i.alternate,e!==null&&uo(e)===null){n.child=i;break}e=i.sibling,i.sibling=t,t=i,i=e}Ao(n,!0,t,null,l,a);break;case"together":Ao(n,!1,null,null,void 0,a);break;case"independent":n.memoizedState=null;break;default:t=Qf(n.child),t===null?(i=n.child,n.child=null):(i=t.sibling,t.sibling=null),Ao(n,!1,i,t,l,a)}return n.child}function Kf(e,n,t){var a=n.pendingProps;return Ut(n,n.type,a.value),Pe(e,n,a.children,t),n.child}function Ct(e,n,t){if(e!==null&&(n.dependencies=e.dependencies),Wt|=n.lanes,(t&n.childLanes)===0)if(e!==null){if(wa(e,n,t,!1),(t&n.childLanes)===0)return null}else return null;if(e!==null&&n.child!==e.child)throw Error(c(153));if(n.child!==null){for(e=n.child,t=wt(e,e.pendingProps),n.child=t,t.return=n;e.sibling!==null;)e=e.sibling,t=t.sibling=wt(e,e.pendingProps),t.return=n;t.sibling=null}return n.child}function _s(e,n){return(e.lanes&n)!==0?!0:(e=e.dependencies,!!(e!==null&&to(e)))}function Lv(e,n,t){switch(n.tag){case 3:ua(n,n.stateNode.containerInfo),Ut(n,Ke,e.memoizedState.cache),ya();break;case 27:case 5:Ri(n);break;case 4:ua(n,n.stateNode.containerInfo);break;case 10:Ut(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,cs(n),null;break;case 13:var a=n.memoizedState;if(a!==null){if(a.dehydrated!==null)return Zt(n),n.flags|=128,null;a=wa(e,n,t,!1);var i=n.child.childLanes;return a||(t&i)!==0?Xf(e,n,t):(Zt(n),e=Ct(e,n,t),e!==null?e.sibling:null)}Zt(n);break;case 19:if(n.flags&128)return Is(e,n,t);if(i=(e.flags&128)!==0,a=(t&n.childLanes)!==0,a||(wa(e,n,t,!1),a=(t&n.childLanes)!==0),i){if(a)return Is(e,n,t);n.flags|=128}if(i=n.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),tl(n,un.current),a)break;return null;case 22:return n.lanes=0,Hf(e,n,t,n.pendingProps);case 24:Ut(n,Ke,e.memoizedState.cache)}return Ct(e,n,t)}function Jf(e,n,t){if(e!==null)if(e.memoizedProps!==n.pendingProps)$e=!0;else{if(!_s(e,t)&&(n.flags&128)===0)return $e=!1,Lv(e,n,t);$e=(e.flags&131072)!==0}else $e=!1,fe&&(n.flags&1048576)!==0&&Ad(n,Qi,n.index);switch(n.lanes=0,n.tag){case 16:e:{var a=n.pendingProps;if(e=Aa(n.elementType),n.type=e,typeof e=="function")Xr(e)?(a=Na(e,a),n.tag=1,n=Vf(null,n,e,a,t)):(n.tag=0,n=zs(null,n,e,a,t));else{if(e!=null){var i=e.$$typeof;if(i===j){n.tag=11,n=Bf(null,n,e,a,t);break e}else if(i===he){n.tag=14,n=If(null,n,e,a,t);break e}else if(i===de){n.tag=10,n.type=e,n=Kf(null,n,t);break e}}throw n=oe(e)||e,Error(c(306,n,""))}}return n;case 0:return zs(e,n,n.type,n.pendingProps,t);case 1:return a=n.type,i=Na(a,n.pendingProps),Vf(e,n,a,i,t);case 3:e:{if(ua(n,n.stateNode.containerInfo),e===null)throw Error(c(387));a=n.pendingProps;var l=n.memoizedState;i=l.element,is(e,n),nl(n,a,null,t);var o=n.memoizedState;if(a=o.cache,Ut(n,Ke,a),a!==l.cache&&Fr(n,[Ke],t,!0),el(),a=o.element,l.isDehydrated)if(l={element:a,isDehydrated:!1,cache:o.cache},n.updateQueue.baseState=l,n.memoizedState=l,n.flags&256){n=Yf(e,n,a,t);break e}else if(a!==i){i=qn(Error(c(424)),n),Ki(i),n=Yf(e,n,a,t);break e}else for(e=n.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,Ie=Zn(e.firstChild),tn=n,fe=!0,_t=null,Yn=!0,t=_d(n,null,a,t),n.child=t;t;)t.flags=t.flags&-3|134221824,t=t.sibling;else{if(ya(),a===i){n=Ct(e,n,t);break e}Pe(e,n,a,t)}n=n.child}return n;case 26:return li(e,n),e===null?(t=xp(n.type,null,n.pendingProps,null))?n.memoizedState=t:fe||(n.stateNode=Pm(n.type,n.pendingProps,tt.current,n)):n.memoizedState=xp(n.type,e.memoizedProps,n.pendingProps,e.memoizedState),null;case 27:return Ri(n),e===null&&fe&&(a=n.stateNode=hp(n.type,n.pendingProps,tt.current),tn=n,Yn=!0,i=Ie,na(n.type)?(jc=i,Ie=Zn(a.firstChild)):Ie=i),Pe(e,n,n.pendingProps.children,t),li(e,n),e===null&&(n.flags|=4194304),n.child;case 5:return e===null&&fe&&((i=a=Ie)&&(a=Tb(a,n.type,n.pendingProps,Yn),a!==null?(n.stateNode=a,tn=n,Ie=Zn(a.firstChild),Yn=!1,i=!0):i=!1),i||Ht(n)),Ri(n),i=n.type,l=n.pendingProps,o=e!==null?e.memoizedProps:null,a=l.children,Ac(i,l)?a=null:o!==null&&Ac(i,o)&&(n.flags|=32),n.memoizedState!==null&&(i=fs(e,n,yv,null,null,t),Ei._currentValue=i),li(e,n),Pe(e,n,a,t),n.child;case 6:return e===null&&fe&&((e=t=Ie)&&(t=Ab(t,n.pendingProps,Yn),t!==null?(n.stateNode=t,tn=n,Ie=null,e=!0):e=!1),e||Ht(n)),null;case 13:return Xf(e,n,t);case 4:return ua(n,n.stateNode.containerInfo),a=n.pendingProps,e===null?n.child=Ca(n,null,a,t):Pe(e,n,a,t),n.child;case 11:return Bf(e,n,n.type,n.pendingProps,t);case 7:return a=n.pendingProps,li(e,n),Pe(e,n,a,t),n.child;case 8:return Pe(e,n,n.pendingProps.children,t),n.child;case 12:return Pe(e,n,n.pendingProps.children,t),n.child;case 10:return Kf(e,n,t);case 9:return i=n.type._context,a=n.pendingProps.children,Sa(n),i=sn(i),a=a(i),n.flags|=1,Pe(e,n,a,t),n.child;case 14:return If(e,n,n.type,n.pendingProps,t);case 15:return _f(e,n,n.type,n.pendingProps,t);case 19:return Is(e,n,t);case 31:return kv(e,n,t);case 22:return Hf(e,n,t,n.pendingProps);case 24:return Sa(n),a=sn(Ke),e===null?(i=ns(),i===null&&(i=Be,l=Pr(),i.pooledCache=l,l.refCount++,l!==null&&(i.pooledCacheLanes|=t),i=l),n.memoizedState={parent:a,cache:i},as(n),Ut(n,Ke,i)):((e.lanes&t)!==0&&(is(e,n),nl(n,null,null,t),el()),i=e.memoizedState,l=n.memoizedState,i.parent!==a?(i={parent:a,cache:a},n.memoizedState=i,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=i),Ut(n,Ke,a)):(a=l.cache,Ut(n,Ke,a),a!==i.cache&&Fr(n,[Ke],t,!0))),Pe(e,n,n.pendingProps.children,t),n.child;case 30:return n.stateNode===null&&(n.stateNode={autoName:null,paired:null,clones:null,ref:null}),a=n.pendingProps,a.name!=null&&a.name!=="auto"?n.flags|=e===null?18882560:18874368:fe&&Pl(n),e!==null&&e.memoizedProps.name!==a.name?n.flags|=4194816:li(e,n),Pe(e,n,a.children,t),n.child;case 29:throw n.pendingProps}throw Error(c(156,n.tag))}function kt(e){e.flags|=4}function Hs(e,n,t,a,i){var l;if((l=(e.mode&32)!==0)&&(l=t===null?Tp(n,a):Tp(n,a)&&(a.src!==t.src||a.srcSet!==t.srcSet)),l){if(e.flags|=16777216,(i&335544128)===i)if(e.stateNode.complete)e.flags|=8192;else if(Lm())e.flags|=8192;else throw Ma=oo,ts}else e.flags&=-16777217}function $f(e,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!Ap(n))if(Lm())e.flags|=8192;else throw Ma=oo,ts}function Mo(e,n){n!==null&&(e.flags|=4),e.flags&16384&&(n=e.tag!==22?Eu():536870912,e.lanes|=n,ui|=n)}function rl(e,n){if(!fe)switch(e.tailMode){case"visible":break;case"collapsed":for(var t=e.tail,a=null;t!==null;)t.alternate!==null&&(a=t),t=t.sibling;a===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:a.sibling=null;break;default:for(n=e.tail,t=null;n!==null;)n.alternate!==null&&(t=n),n=n.sibling;t===null?e.tail=null:t.sibling=null}}function _e(e){var n=e.alternate!==null&&e.alternate.child===e.child,t=0,a=0;if(n)for(var i=e.child;i!==null;)t|=i.lanes|i.childLanes,a|=i.subtreeFlags&1206910976,a|=i.flags&1206910976,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)t|=i.lanes|i.childLanes,a|=i.subtreeFlags,a|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=a,e.childLanes=t,n}function zv(e,n,t){var a=n.pendingProps;switch(Kr(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return _e(n),null;case 1:return _e(n),null;case 3:return t=n.stateNode,a=null,e!==null&&(a=e.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),Tt(Ke),Ot(),t.pendingContext&&(t.context=t.pendingContext,t.pendingContext=null),(e===null||e.child===null)&&(Fa(n)?kt(n):e===null||e.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,$r())),_e(n),null;case 26:var i=n.type,l=n.memoizedState;return e===null?(kt(n),l!==null?(_e(n),$f(n,l)):(_e(n),Hs(n,i,null,a,t))):l?l!==e.memoizedState?(kt(n),_e(n),$f(n,l)):(_e(n),n.flags&=-16777217):(e=e.memoizedProps,e!==a&&kt(n),_e(n),Hs(n,i,e,a,t)),null;case 27:if(le(n),t=tt.current,i=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==a&&kt(n);else{if(!a){if(n.stateNode===null)throw Error(c(166));return _e(n),n.subtreeFlags&=-33554433,null}e=_n.current,Fa(n)?Cd(n):(e=hp(i,a,t),n.stateNode=e,kt(n))}return _e(n),n.subtreeFlags&=-33554433,null;case 5:if(le(n),i=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==a&&kt(n);else{if(!a){if(n.stateNode===null)throw Error(c(166));return _e(n),n.subtreeFlags&=-33554433,null}if(l=_n.current,Fa(n))Cd(n);else{var o=bl(tt.current);switch(l){case 1:l=o.createElementNS("http://www.w3.org/2000/svg",i);break;case 2:l=o.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;default:switch(i){case"svg":l=o.createElementNS("http://www.w3.org/2000/svg",i);break;case"math":l=o.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;case"script":l=o.createElement("div"),l.innerHTML="<script><\/script>",l=l.removeChild(l.firstChild);break;case"select":l=typeof a.is=="string"?o.createElement("select",{is:a.is}):o.createElement("select"),a.multiple?l.multiple=!0:a.size&&(l.size=a.size);break;default:l=typeof a.is=="string"?o.createElement(i,{is:a.is}):o.createElement(i)}}l[rn]=n,l[bn]=a;e:for(o=n.child;o!==null;){if(o.tag===5||o.tag===6)l.appendChild(o.stateNode);else if(o.tag!==4&&o.tag!==27&&o.child!==null){o.child.return=o,o=o.child;continue}if(o===n)break e;for(;o.sibling===null;){if(o.return===null||o.return===n)break e;o=o.return}o.sibling.return=o.return,o=o.sibling}n.stateNode=l;e:switch(fn(l,i,a),i){case"button":case"input":case"select":case"textarea":a=!!a.autoFocus;break e;case"img":a=!0;break e;default:a=!1}a&&kt(n)}}return _e(n),n.subtreeFlags&=-33554433,Hs(n,n.type,e===null?null:e.memoizedProps,n.pendingProps,t),null;case 6:if(e&&n.stateNode!=null)e.memoizedProps!==a&&kt(n);else{if(typeof a!="string"&&n.stateNode===null)throw Error(c(166));if(e=tt.current,Fa(n)){if(e=n.stateNode,t=n.memoizedProps,a=null,i=tn,i!==null)switch(i.tag){case 27:case 5:a=i.memoizedProps}e[rn]=n,e=!!(e.nodeValue===t||a!==null&&a.suppressHydrationWarning===!0||Jm(e.nodeValue,t)),e||Ht(n,!0)}else e=bl(e).createTextNode(a),e[rn]=n,n.stateNode=e}return _e(n),null;case 31:if(t=n.memoizedState,e===null||e.memoizedState!==null){if(a=Fa(n),t!==null){if(e===null){if(!a)throw Error(c(318));if(e=n.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(557));e[rn]=n}else ya(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;_e(n),e=!1}else t=$r(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=t),e=!0;if(!e)return n.flags&256?(Rn(n),n):(Rn(n),null);if((n.flags&128)!==0)throw Error(c(558))}return _e(n),null;case 13:if(a=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(i=Fa(n),a!==null&&a.dehydrated!==null){if(e===null){if(!i)throw Error(c(318));if(i=n.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(c(317));i[rn]=n}else ya(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;_e(n),i=!1}else i=$r(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=i),i=!0;if(!i)return n.flags&256?(Rn(n),n):(Rn(n),null)}return Rn(n),(n.flags&128)!==0?(n.lanes=t,n):(t=a!==null,e=e!==null&&e.memoizedState!==null,t&&(a=n.child,i=null,a.alternate!==null&&a.alternate.memoizedState!==null&&a.alternate.memoizedState.cachePool!==null&&(i=a.alternate.memoizedState.cachePool.pool),l=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(l=a.memoizedState.cachePool.pool),l!==i&&(a.flags|=2048)),t!==e&&t&&(n.child.flags|=8192),Mo(n,n.updateQueue),_e(n),null);case 4:return Ot(),e===null&&xc(n.stateNode.containerInfo),n.flags|=67108864,_e(n),null;case 10:return Tt(n.type),_e(n),null;case 19:if(us(n),a=n.memoizedState,a===null)return _e(n),null;if(i=(n.flags&128)!==0,l=a.rendering,l===null)if(i)rl(a,!1);else{if(Xe!==0||e!==null&&(e.flags&128)!==0)for(e=n.child;e!==null;){if(l=uo(e),l!==null){for(n.flags|=128,rl(a,!1),e=l.updateQueue,n.updateQueue=e,Mo(n,e),n.subtreeFlags=0,e=t,t=n.child;t!==null;)Sd(t,e),t=t.sibling;return tl(n,un.current&1|2),fe&&St(n,a.treeForkCount),n.child}e=e.sibling}a.tail!==null&&Cn()>_o&&(n.flags|=128,i=!0,rl(a,!1),n.lanes=4194304)}else{if(!i)if(e=uo(l),e!==null){if(n.flags|=128,i=!0,e=e.updateQueue,n.updateQueue=e,Mo(n,e),rl(a,!0),a.tail===null&&a.tailMode!=="collapsed"&&a.tailMode!=="visible"&&!l.alternate&&!fe)return _e(n),null}else 2*Cn()-a.renderingStartTime>_o&&t!==536870912&&(n.flags|=128,i=!0,rl(a,!1),n.lanes=4194304);a.isBackwards?(l.sibling=n.child,n.child=l):(e=a.last,e!==null?e.sibling=l:n.child=l,a.last=l)}if(a.tail!==null){e=a.tail;e:{for(t=e;t!==null;){if(t.alternate!==null){t=!1;break e}t=t.sibling}t=!0}return a.rendering=e,a.tail=e.sibling,a.renderingStartTime=Cn(),e.sibling=null,l=un.current,l=i?l&1|2:l&1,a.tailMode==="visible"||a.tailMode==="collapsed"||!t||fe?tl(n,l):(t=l,Le(cn,n),Le(un,t),mn===null&&(mn=n)),fe&&St(n,a.treeForkCount),e}return _e(n),null;case 22:case 23:return Rn(n),ss(),a=n.memoizedState!==null,e!==null?e.memoizedState!==null!==a&&(n.flags|=8192):a&&(n.flags|=8192),a?(t&536870912)!==0&&(n.flags&128)===0&&(_e(n),n.subtreeFlags&6&&(n.flags|=8192)):_e(n),t=n.updateQueue,t!==null&&Mo(n,t.retryQueue),t=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(t=e.memoizedState.cachePool.pool),a=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(a=n.memoizedState.cachePool.pool),a!==t&&(n.flags|=2048),e!==null&&Ze(Ta),null;case 24:return t=null,e!==null&&(t=e.memoizedState.cache),n.memoizedState.cache!==t&&(n.flags|=2048),Tt(Ke),_e(n),null;case 25:return null;case 30:return n.flags|=33554432,_e(n),null}throw Error(c(156,n.tag))}function Rv(e,n){switch(Kr(n),n.tag){case 1:return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return Tt(Ke),Ot(),e=n.flags,(e&65536)!==0&&(e&128)===0?(n.flags=e&-65537|128,n):null;case 26:case 27:case 5:return le(n),null;case 31:if(n.memoizedState!==null){if(Rn(n),n.alternate===null)throw Error(c(340));ya()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 13:if(Rn(n),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(c(340));ya()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return us(n),e=n.flags,e&65536?(n.flags=e&-65537|128,e=n.memoizedState,e!==null&&(e.rendering=null,e.tail=null),n.flags|=4,n):null;case 4:return Ot(),null;case 10:return Tt(n.type),null;case 22:case 23:return Rn(n),ss(),e!==null&&Ze(Ta),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 24:return Tt(Ke),null;case 25:return null;default:return null}}function Wf(e,n){switch(Kr(n),n.tag){case 3:Tt(Ke),Ot();break;case 26:case 27:case 5:le(n);break;case 4:Ot();break;case 31:n.memoizedState!==null&&Rn(n);break;case 13:Rn(n);break;case 19:us(n);break;case 10:Tt(n.type);break;case 22:case 23:Rn(n),ss(),e!==null&&Ze(Ta);break;case 24:Tt(Ke)}}function sl(e,n){try{var t=n.updateQueue,a=t!==null?t.lastEffect:null;if(a!==null){var i=a.next;t=i;do{if((t.tag&e)===e){a=void 0;var l=t.create,o=t.inst;a=l(),o.destroy=a}t=t.next}while(t!==i)}}catch(s){Re(n,n.return,s)}}function Kt(e,n,t){try{var a=n.updateQueue,i=a!==null?a.lastEffect:null;if(i!==null){var l=i.next;a=l;do{if((a.tag&e)===e){var o=a.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=n;var u=t,v=s;try{v()}catch(T){Re(i,u,T)}}}a=a.next}while(a!==l)}}catch(T){Re(n,n.return,T)}}function Ff(e){var n=e.updateQueue;if(n!==null){var t=e.stateNode;try{Ud(n,t)}catch(a){Re(e,e.return,a)}}}function Pf(e,n,t){t.props=Na(e.type,e.memoizedProps),t.state=e.memoizedState;try{t.componentWillUnmount()}catch(a){Re(e,n,a)}}function st(e,n){try{var t=e.ref;if(t!==null){switch(e.tag){case 26:case 27:case 5:var a=e.stateNode;break;case 30:var i=e.stateNode,l=yt(e.memoizedProps,i);(i.ref===null||i.ref.name!==l)&&(i.ref=op(l)),a=i.ref;break;case 7:if(e.stateNode===null){var o=new In(e);y(e.child,!1,Sb,o,void 0,void 0),e.stateNode=o}a=e.stateNode;break;default:a=e.stateNode}typeof t=="function"?e.refCleanup=t(a):t.current=a}}catch(s){Re(e,n,s)}}function dn(e,n){var t=e.ref,a=e.refCleanup;if(t!==null)if(typeof a=="function")try{a()}catch(i){Re(e,n,i)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof t=="function")try{t(null)}catch(i){Re(e,n,i)}else t.current=null}function Co(e,n){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&n!==null)for(var t=0;t<n.length;t++)fp(e.stateNode,n[t])}function em(e){for(var n=e.return;n!==null&&(qs(n)&&fp(e.stateNode,n.stateNode),!Us(n));)n=n.return}function cl(e){for(var n=e.return;n!==null&&(qs(n)&&Eb(e.stateNode,n.stateNode),!Us(n));)n=n.return}function Us(e){return e.tag===5||e.tag===3||e.tag===27}function qs(e){return e&&e.tag===7&&e.stateNode!==null}function Gs(e){var n=e.type,t=e.memoizedProps,a=e.stateNode;try{e:switch(n){case"button":case"input":case"select":case"textarea":t.autoFocus&&a.focus();break e;case"img":t.src?a.src=t.src:t.srcSet&&(a.srcset=t.srcSet)}}catch(i){Re(e,e.return,i)}}function Vs(e,n,t){try{var a=e.stateNode;ib(a,e.type,t,n),a[bn]=n}catch(i){Re(e,e.return,i)}}function nm(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&na(e.type)||e.tag===4}function Ys(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||nm(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&na(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Xs(e,n,t,a){var i=e.tag;if(i===5||i===6)i=e.stateNode,n?(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t).insertBefore(i,n):(n=t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,n.appendChild(i),t=t._reactRootContainer,t!=null||n.onclick!==null||(n.onclick=lt)),Co(e,a),Ae=!0;else if(i!==4&&(i===27&&(Co(e,a),a=null,na(e.type)&&(t=e.stateNode,n=null)),e=e.child,e!==null))for(Xs(e,n,t,a),e=e.sibling;e!==null;)Xs(e,n,t,a),e=e.sibling}function ko(e,n,t,a){var i=e.tag;if(i===5||i===6)i=e.stateNode,n?t.insertBefore(i,n):t.appendChild(i),Co(e,a),Ae=!0;else if(i!==4&&(i===27&&(Co(e,a),a=null,na(e.type)&&(t=e.stateNode)),e=e.child,e!==null))for(ko(e,n,t,a),e=e.sibling;e!==null;)ko(e,n,t,a),e=e.sibling}function tm(e){var n=e.stateNode,t=e.memoizedProps;try{for(var a=e.type,i=n.attributes;i.length;)n.removeAttributeNode(i[0]);fn(n,a,t),n[rn]=e,n[bn]=t}catch(l){Re(e,e.return,l)}}var No=!1,On=null;function am(e){(e.tag===30||(e.subtreeFlags&33554432)!==0)&&(No=!0)}var ct=null;function im(){var e=ct;return ct=null,e}var xn=0;function oi(e,n,t,a,i){return xn=0,lm(e.child,n,t,a,i)}function lm(e,n,t,a,i){for(var l=!1;e!==null;){if(e.tag===5){var o=e.stateNode;if(a!==null){var s=kc(o);a.push(s),s.view&&(l=!0)}else l||kc(o).view&&(l=!0);No=!0,ip(o,xn===0?n:n+"_"+xn,t),xn++}else(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&i||lm(e.child,n,t,a,i)&&(l=!0));e=e.sibling}return l}function ut(e,n){for(;e!==null;)e.tag===5?lp(e.stateNode,e.memoizedProps):(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&n||ut(e.child,n)),e=e.sibling}function Lo(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(Lo(e),e.tag===30&&(e.flags&18874368)!==0&&e.stateNode.paired)){var n=e.memoizedProps;if(n.name==null||n.name==="auto")throw Error(c(544));var t=n.name;n=xt(n.default,n.share),n!=="none"&&(oi(e,t,n,null,!1)||ut(e.child,!1))}e=e.sibling}}function Zs(e,n){if(e.tag===30){var t=e.stateNode,a=e.memoizedProps,i=yt(a,t),l=xt(a.default,t.paired?a.share:a.enter);l!=="none"?oi(e,i,l,null,!1)?(Lo(e),t.paired||n||pi(e,a.onEnter)):ut(e.child,!1):Lo(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Zs(e,n),e=e.sibling;else Lo(e)}function Qs(e){if(On!==null&&On.size!==0){var n=On;if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var t=e.memoizedProps,a=t.name;if(a!=null&&a!=="auto"){var i=n.get(a);if(i!==void 0){var l=xt(t.default,t.share);if(l!=="none"&&(oi(e,a,l,null,!1)?(l=e.stateNode,i.paired=l,l.paired=i,pi(e,t.onShare)):ut(e.child,!1)),n.delete(a),n.size===0)break}}}Qs(e)}e=e.sibling}}}function Ks(e){if(e.tag===30){var n=e.memoizedProps,t=yt(n,e.stateNode),a=On!==null?On.get(t):void 0,i=xt(n.default,a!==void 0?n.share:n.exit);i!=="none"&&(oi(e,t,i,null,!1)?a!==void 0?(i=e.stateNode,a.paired=i,i.paired=a,On.delete(t),pi(e,n.onShare)):pi(e,n.onExit):ut(e.child,!1)),On!==null&&Qs(e)}else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)Ks(e),e=e.sibling;else On!==null&&Qs(e)}function om(e){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,t=yt(n,e.stateNode);n=xt(n.default,n.update),e.flags&=-5,n!=="none"&&oi(e,t,n,e.memoizedState=[],!1)}else(e.subtreeFlags&33554432)!==0&&om(e);e=e.sibling}}function Js(e){if((e.subtreeFlags&18874368)!==0)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&(e.flags&18874368)!==0){var n=e.stateNode;n.paired!==null&&(n.paired=null,ut(e.child,!1))}Js(e)}e=e.sibling}}function zo(e){if(e.tag===30)e.stateNode.paired=null,ut(e.child,!1),Js(e);else if((e.subtreeFlags&33554432)!==0)for(e=e.child;e!==null;)zo(e),e=e.sibling;else Js(e)}function rm(e){for(e=e.child;e!==null;)e.tag===30?ut(e.child,!1):(e.subtreeFlags&33554432)!==0&&rm(e),e=e.sibling}function $s(e,n,t,a,i,l,o){for(var s=!1;n!==null;){if(n.tag===5){var u=n.stateNode;if(l!==null&&xn<l.length){var v=l[xn],T=kc(u);(v.view||T.view)&&(s=!0);var k;if(k=(e.flags&4)===0)if(T.clip)k=!0;else{k=v.rect;var p=T.rect;k=k.y!==p.y||k.x!==p.x||k.height!==p.height||k.width!==p.width}k&&(e.flags|=4),T.abs?T=!v.abs:(v=v.rect,T=T.rect,T=v.height!==T.height||v.width!==T.width),T&&(e.flags|=32)}else e.flags|=32;(e.flags&4)!==0&&ip(u,xn===0?t:t+"_"+xn,i),s&&(e.flags&4)!==0||(ct===null&&(ct=[]),ct.push(u,xn===0?a:a+"_"+xn,n.memoizedProps)),xn++}else(n.tag!==22||n.memoizedState===null)&&(n.tag===30&&o?e.flags|=n.flags&32:$s(e,n.child,t,a,i,l,o)&&(s=!0));n=n.sibling}return s}function sm(e,n){for(e=e.child;e!==null;){if(e.tag===30){var t=e.memoizedProps,a=e.stateNode,i=yt(t,a),l=xt(t.default,t.update),o;o=e.memoizedState,e.memoizedState=null,a=e;var s=e.child;xn=0,i=$s(a,s,i,i,l,o,!1),(e.flags&4)!==0&&i&&pi(e,t.onUpdate)}else(e.subtreeFlags&33554432)!==0&&sm(e);e=e.sibling}}var an=!1,ke=!1,dt=!1,Ws=!1,cm=typeof WeakSet=="function"?WeakSet:Set,ln=null,ft=!1,ul=!1,Ro=!1,Fs=!1;function Ov(e,n,t){if(e=e.containerInfo,Ec=Ti,e=fd(e),_r(e)){if("selectionStart"in e)var a={start:e.selectionStart,end:e.selectionEnd};else e:{a=(a=e.ownerDocument)&&a.defaultView||window;var i=a.getSelection&&a.getSelection();if(i&&i.rangeCount!==0){a=i.anchorNode;var l=i.anchorOffset,o=i.focusNode;i=i.focusOffset;try{a.nodeType,o.nodeType}catch{a=null;break e}var s=0,u=-1,v=-1,T=0,k=0,p=e,w=null;n:for(;;){for(var I;p!==a||l!==0&&p.nodeType!==3||(u=s+l),p!==o||i!==0&&p.nodeType!==3||(v=s+i),p.nodeType===3&&(s+=p.nodeValue.length),(I=p.firstChild)!==null;)w=p,p=I;for(;;){if(p===e)break n;if(w===a&&++T===l&&(u=s),w===o&&++k===i&&(v=s),(I=p.nextSibling)!==null)break;p=w,w=p.parentNode}p=I}a=u===-1||v===-1?null:{start:u,end:v}}else a=null}a=a||{start:0,end:0}}else a=null;for(Tc={focusedElem:e,selectionRange:a},Ti=!1,t=(t&335544064)===t,ln=n,n=t?9270:1024;ln!==null;){if(e=ln,t&&(a=e.deletions,a!==null))for(l=0;l<a.length;l++)t&&Ks(a[l]);if(e.alternate===null&&(e.flags&2)!==0)t&&am(e),Oo(t);else{if(e.tag===22){if(a=e.alternate,e.memoizedState!==null){a!==null&&a.memoizedState===null&&t&&Ks(a),Oo(t);continue}else if(a!==null&&a.memoizedState!==null){t&&am(e),Oo(t);continue}}a=e.child,(e.subtreeFlags&n)!==0&&a!==null?(a.return=e,ln=a):(t&&om(e),Oo(t))}}On=null}function Oo(e){for(;ln!==null;){var n=ln,t=e,a=n.alternate,i=n.flags;switch(n.tag){case 0:case 11:case 15:break;case 1:if((i&1024)!==0&&a!==null){t=void 0,i=a.memoizedProps,a=a.memoizedState;var l=n.stateNode;try{var o=Na(n.type,i);t=l.getSnapshotBeforeUpdate(o,a),l.__reactInternalSnapshotBeforeUpdate=t}catch(s){Re(n,n.return,s)}}break;case 3:if((i&1024)!==0){if(a=n.stateNode.containerInfo,t=a.nodeType,t===9)zc(a);else if(t===1)switch(a.nodeName){case"HEAD":case"HTML":case"BODY":zc(a);break;default:a.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:t&&a!==null&&(t=yt(a.memoizedProps,a.stateNode),i=n.memoizedProps,i=xt(i.default,i.update),i!=="none"&&oi(a,t,i,a.memoizedState=[],!0));break;default:if((i&1024)!==0)throw Error(c(163))}if(a=n.sibling,a!==null){a.return=n.return,ln=a;break}ln=n.return}}function um(e,n,t){var a=t.flags;switch(t.tag){case 0:case 11:case 15:mt(e,t),a&4&&sl(5,t);break;case 1:if(mt(e,t),a&4)if(e=t.stateNode,n===null)try{e.componentDidMount()}catch(o){Re(t,t.return,o)}else{var i=Na(t.type,n.memoizedProps);n=n.memoizedState;try{e.componentDidUpdate(i,n,e.__reactInternalSnapshotBeforeUpdate)}catch(o){Re(t,t.return,o)}}a&64&&Ff(t),a&512&&st(t,t.return);break;case 3:if(mt(e,t),a&64&&(e=t.updateQueue,e!==null)){if(n=null,t.child!==null)switch(t.child.tag){case 27:case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}try{Ud(e,n)}catch(o){Re(t,t.return,o)}}break;case 27:n===null&&a&4&&tm(t);case 26:case 5:mt(e,t),n===null&&a&4&&Gs(t),a&512&&st(t,t.return);break;case 12:mt(e,t);break;case 31:mt(e,t),a&4&&pm(e,t);break;case 13:mt(e,t),a&4&&gm(e,t),a&64&&(e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(t=Xv.bind(null,t),Mb(e,t))));break;case 22:if(a=t.memoizedState!==null||an,!a){var l=n!==null&&n.memoizedState!==null||ke;n=an,i=ke,an=a,(ke=l)&&!i?(a=2,(t.subtreeFlags&8772)!==0&&(a|=1),Pn(e,t,a)):mt(e,t),an=n,ke=i}break;case 30:mt(e,t),a&512&&st(t,t.return);break;case 7:a&512&&st(t,t.return);default:mt(e,t)}}function Ps(e,n){for(e=e.child;e!==null;)dm(e,n),e=e.sibling}function dm(e,n){switch(e.tag){case 5:case 26:try{var t=e.stateNode;if(n){var a=t.style;typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"}else{var i=e.stateNode,l=e.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null;i.style.display=o==null||typeof o=="boolean"?"":(""+o).trim()}}catch(u){Re(e,e.return,u)}ec(e,n);break;case 6:try{e.stateNode.nodeValue=n?"":e.memoizedProps,Ae=!0}catch(u){Re(e,e.return,u)}break;case 18:try{var s=e.stateNode;n?ap(s,!0):ap(e.stateNode,!1)}catch(u){Re(e,e.return,u)}break;case 22:case 23:e.memoizedState===null&&Ps(e,n);break;default:Ps(e,n)}}function ec(e,n){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){e:{var t=e,a=n;switch(t.tag){case 4:dm(t,a);break e;case 22:t.memoizedState===null&&ec(t,a);break e;default:ec(t,a)}}e=e.sibling}}function fm(e){var n=e.alternate;n!==null&&(e.alternate=null,fm(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&Il(n)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var qe=null,wn=!1;function Wn(e,n,t){for(t=t.child;t!==null;)mm(e,n,t),t=t.sibling}function mm(e,n,t){if(kn&&typeof kn.onCommitFiberUnmount=="function")try{kn.onCommitFiberUnmount(Oi,t)}catch{}switch(t.tag){case 26:ke||dn(t,n),Wn(e,n,t),t.memoizedState?t.memoizedState.count--:t.stateNode&&!ke&&(t=t.stateNode,t.parentNode.removeChild(t));break;case 27:ke||dn(t,n),cl(t);var a=qe,i=wn;na(t.type)&&(qe=t.stateNode,wn=!1),Wn(e,n,t),vp(t.stateNode,t.type,t.memoizedProps),qe=a,wn=i;break;case 5:ke||dn(t,n),cl(t);case 6:if(t.tag===6&&cl(t),a=qe,i=wn,qe=null,Wn(e,n,t),qe=a,wn=i,qe!==null)if(wn)try{(qe.nodeType===9?qe.body:qe.nodeName==="HTML"?qe.ownerDocument.body:qe).removeChild(t.stateNode),Ae=!0}catch(l){Re(t,n,l)}else try{qe.removeChild(t.stateNode),Ae=!0}catch(l){Re(t,n,l)}break;case 18:qe!==null&&(wn?(e=qe,tp(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,t.stateNode),Ai(e)):tp(qe,t.stateNode));break;case 4:a=qe,i=wn,qe=t.stateNode.containerInfo,wn=!0,Wn(e,n,t),qe=a,wn=i;break;case 0:case 11:case 14:case 15:Kt(2,t,n),ke||Kt(4,t,n),Wn(e,n,t);break;case 1:ke||(dn(t,n),a=t.stateNode,typeof a.componentWillUnmount=="function"&&Pf(t,n,a)),Wn(e,n,t);break;case 21:Wn(e,n,t);break;case 22:ke=(a=ke)||t.memoizedState!==null,Wn(e,n,t),ke=a;break;case 30:dn(t,n),Wn(e,n,t);break;case 7:ke||dn(t,n),Wn(e,n,t);break;default:Wn(e,n,t)}}function pm(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Ai(e)}catch(t){Re(n,n.return,t)}}}function gm(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Ai(e)}catch(t){Re(n,n.return,t)}}function jv(e){switch(e.tag){case 31:case 13:case 19:var n=e.stateNode;return n===null&&(n=e.stateNode=new cm),n;case 22:return e=e.stateNode,n=e._retryCache,n===null&&(n=e._retryCache=new cm),n;default:throw Error(c(435,e.tag))}}function jo(e,n){var t=jv(e);n.forEach(function(a){if(!t.has(a)){t.add(a);var i=Zv.bind(null,e,a);a.then(i,i)}})}function hn(e,n,t){var a=n.deletions;if(a!==null)for(var i=0;i<a.length;i++){var l=a[i],o=e,s=n,u=s;e:for(;u!==null;){switch(u.tag){case 27:if(na(u.type)){qe=u.stateNode,wn=!1;break e}break;case 5:qe=u.stateNode,wn=!1;break e;case 3:case 4:qe=u.stateNode.containerInfo,wn=!0;break e}u=u.return}if(qe===null)throw Error(c(160));mm(o,s,l),qe=null,wn=!1,o=l.alternate,o!==null&&(o.return=null),l.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)hm(n,e,t),n=n.sibling}var Fn=null;function hm(e,n,t){var a=e.alternate,i=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(i&4&&(a=e.updateQueue,a=a!==null?a.events:null,a!==null))for(var l=0;l<a.length;l++){var o=a[l];o.ref.impl=o.nextImpl}hn(n,e,t),vn(e),i&4&&(Kt(3,e,e.return),sl(3,e),Kt(5,e,e.return));break;case 1:hn(n,e,t),vn(e),i&512&&(ke||a===null||dn(a,a.return)),i&64&&an&&(e=e.updateQueue,e!==null&&(n=e.callbacks,n!==null&&(t=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=t===null?n:t.concat(n))));break;case 26:if(l=Fn,hn(n,e,t),vn(e),i&512&&(ke||a===null||dn(a,a.return)),i&4)if(i=a!==null?a.memoizedState:null,t=e.memoizedState,a===null)if(t===null)if(e.stateNode===null)if(an)e.stateNode=Pm(e.type,e.memoizedProps,n.containerInfo,e);else{e:{n=e.type,t=e.memoizedProps,i=l.ownerDocument||l;n:switch(n){case"title":a=i.getElementsByTagName("title")[0],(!a||a[Bi]||a[rn]||a.namespaceURI==="http://www.w3.org/2000/svg"||a.hasAttribute("itemprop"))&&(a=i.createElement(n),i.head.insertBefore(a,i.querySelector("head > title"))),fn(a,n,t),a[rn]=e,nn(a),n=a;break e;case"link":if(l=Ep("link","href",i).get(n+(t.href||""))){for(o=0;o<l.length;o++)if(a=l[o],a.getAttribute("href")===(t.href==null||t.href===""?null:t.href)&&a.getAttribute("rel")===(t.rel==null?null:t.rel)&&a.getAttribute("title")===(t.title==null?null:t.title)&&a.getAttribute("crossorigin")===(t.crossOrigin==null?null:t.crossOrigin)){l.splice(o,1);break n}}a=i.createElement(n),fn(a,n,t),i.head.appendChild(a);break;case"meta":if(l=Ep("meta","content",i).get(n+(t.content||""))){for(o=0;o<l.length;o++)if(a=l[o],a.getAttribute("content")===(t.content==null?null:""+t.content)&&a.getAttribute("name")===(t.name==null?null:t.name)&&a.getAttribute("property")===(t.property==null?null:t.property)&&a.getAttribute("http-equiv")===(t.httpEquiv==null?null:t.httpEquiv)&&a.getAttribute("charset")===(t.charSet==null?null:t.charSet)){l.splice(o,1);break n}}a=i.createElement(n),fn(a,n,t),i.head.appendChild(a);break;default:throw Error(c(468,n))}a[rn]=e,nn(a),n=a}e.stateNode=n}else an||_c(l,e.type,e.stateNode);else e.stateNode=Sp(l,t,e.memoizedProps);else i!==t?(i===null?(n=a.stateNode,n===null||ke||n.parentNode.removeChild(n)):i.count--,t===null?an||_c(l,e.type,e.stateNode):Sp(l,t,e.memoizedProps)):t===null&&e.stateNode!==null&&Vs(e,e.memoizedProps,a.memoizedProps);break;case 27:hn(n,e,t),vn(e),i&512&&(ke||a===null||dn(a,a.return)),a!==null&&i&4&&Vs(e,e.memoizedProps,a.memoizedProps);break;case 5:if(l=dt,dt=!1,hn(n,e,t),dt=l,vn(e),i&512&&(ke||a===null||dn(a,a.return)),e.flags&32){n=e.stateNode;try{Ga(n,""),Ae=!0}catch(T){Re(e,e.return,T)}}i&4&&e.stateNode!=null&&(n=e.memoizedProps,Vs(e,n,a!==null?a.memoizedProps:n)),i&1024&&(Ws=!0);break;case 6:if(hn(n,e,t),vn(e),i&4){if(e.stateNode===null)throw Error(c(162));n=e.memoizedProps,t=e.stateNode;try{t.nodeValue=n,Ae=!0}catch(T){Re(e,e.return,T)}}break;case 3:if(Ae=!1,Jo=null,l=Fn,Fn=yl(n.containerInfo),hn(n,e,t),Fn=l,vn(e),i&4&&a!==null&&a.memoizedState.isDehydrated)try{Ai(n.containerInfo)}catch(T){Re(e,e.return,T)}Ws&&(Ws=!1,vm(e)),Ae=!1;break;case 4:i=dt,dt=an,a=Bu(),l=Fn,Fn=yl(e.stateNode.containerInfo),hn(n,e,t),vn(e),Fn=l,Ae&&ul&&(Ro=!0),Ae=a,dt=i;break;case 12:hn(n,e,t),vn(e);break;case 31:hn(n,e,t),vn(e),i&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,jo(e,n)));break;case 13:hn(n,e,t),vn(e),e.child.flags&8192&&e.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(Io=Cn()),i&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,jo(e,n)));break;case 22:l=e.memoizedState!==null,o=a!==null&&a.memoizedState!==null;var s=an,u=ke,v=dt;an=s||l,dt=v||l,ke=u||o,hn(n,e,t),ke=u,dt=v,an=s,vn(e),i&8192&&(n=e.stateNode,n._visibility=l?n._visibility&-2:n._visibility|1,!l||a===null||o||an||ke||(n=o||ke,t=an,a=ke,an=l||an,ke=n,Jt(e,2),an=t,ke=a),!l&&dt||Ps(e,l)),i&4&&(n=e.updateQueue,n!==null&&(t=n.retryQueue,t!==null&&(n.retryQueue=null,jo(e,t))));break;case 19:hn(n,e,t),vn(e),i&4&&(n=e.updateQueue,n!==null&&(e.updateQueue=null,jo(e,n)));break;case 30:i&512&&(ke||a===null||dn(a,a.return)),i=Bu(),l=ul,o=(t&335544064)===t,s=e.memoizedProps,ul=o&&xt(s.default,s.update)!=="none",hn(n,e,t),vn(e),o&&a!==null&&Ae&&(e.flags|=4),ul=l,Ae=i;break;case 21:break;case 7:i&512&&(ke||a===null||dn(a,a.return)),a&&a.stateNode!==null&&(a.stateNode._fragmentFiber=e);default:hn(n,e,t),vn(e)}}function vn(e){var n=e.flags;if(n&2){try{for(var t,a=e.return;a!==null;){if(nm(a)){t=a;break}a=a.return}a=null;for(var i=e.return;i!==null;){if(qs(i)){var l=i.stateNode;a===null?a=[l]:a.push(l)}if(Us(i))break;i=i.return}var o=a;if(t==null)throw Error(c(160));switch(t.tag){case 27:var s=t.stateNode,u=Ys(e);ko(e,u,s,o);break;case 5:var v=t.stateNode;t.flags&32&&(Ga(v,""),t.flags&=-33);var T=Ys(e);ko(e,T,v,o);break;case 3:case 4:var k=t.stateNode.containerInfo,p=Ys(e);Xs(e,p,k,o);break;default:throw Error(c(161))}}catch(w){Re(e,e.return,w)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function vm(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var n=e;vm(n),n.tag===5&&n.flags&1024&&(n=n.stateNode,Ti=!0,n.reset(),Ti=!1),e=e.sibling}}function ri(e,n){if(n.subtreeFlags&9270)for(n=n.child;n!==null;)bm(n,e),n=n.sibling;else sm(n)}function bm(e,n){var t=e.alternate;if(t===null)Zs(e,!1);else switch(e.tag){case 3:if(Fs=ft=!1,im(),ri(n,e),!ft&&!Ro){if(e=ct,e!==null)for(var a=0;a<e.length;a+=3){t=e[a];var i=e[a+1];lp(t,e[a+2]),t=t.ownerDocument.documentElement,t!==null&&t.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+i+")"})}e=n.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===""&&(e.style.viewTransitionName="none",e.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),Fs=!0}ct=null;break;case 5:ri(n,e);break;case 4:a=ft,ft=!1,ri(n,e),ft&&(Ro=!0),ft=a;break;case 22:e.memoizedState===null&&(t.memoizedState!==null?Zs(e,!1):ri(n,e));break;case 30:a=ft,i=im(),ft=!1,ri(n,e),ft&&(e.flags|=4);var l=e.memoizedProps,o=e.stateNode;n=yt(l,o),o=yt(t.memoizedProps,o);var s=xt(l.default,l.update);s==="none"?n=!1:(l=t.memoizedState,t.memoizedState=null,t=e.child,xn=0,n=$s(e,t,n,o,s,l,!0),xn!==(l===null?0:l.length)&&(e.flags|=32)),(e.flags&4)!==0&&n?(pi(e,e.memoizedProps.onUpdate),ct=i):i!==null&&(i.push.apply(i,ct),ct=i),ft=(e.flags&32)!==0?!0:a;break;default:ri(n,e)}}function mt(e,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)um(e,n.alternate,n),n=n.sibling}function Jt(e,n){for(e=e.child;e!==null;){var t=e,a=n;switch(t.tag){case 0:case 11:case 14:case 15:Kt(4,t,t.return),Jt(t,a);break;case 1:dn(t,t.return);var i=t.stateNode;typeof i.componentWillUnmount=="function"&&Pf(t,t.return,i),Jt(t,a);break;case 27:(a&2)!==0&&vp(t.stateNode,t.type,t.memoizedProps);case 5:dn(t,t.return),t.tag!==5&&t.tag!==27||cl(t),Jt(t,a);break;case 6:cl(t);break;case 26:dn(t,t.return),i=t.stateNode,t.memoizedState!==null||i===null||ke||i.parentNode.removeChild(i),Jt(t,a);break;case 22:t.memoizedState===null&&Jt(t,a);break;case 30:dn(t,t.return),Jt(t,a);break;case 7:dn(t,t.return);default:Jt(t,a)}e=e.sibling}}function Pn(e,n,t){for(t=(n.subtreeFlags&8772)!==0?t:t&-2,n=n.child;n!==null;){var a=n.alternate,i=e,l=n,o=l.flags,s=(t&1)!==0;switch(l.tag){case 0:case 11:case 15:Pn(i,l,t),sl(4,l);break;case 1:if(Pn(i,l,t),a=l,i=a.stateNode,typeof i.componentDidMount=="function")try{i.componentDidMount()}catch(T){Re(a,a.return,T)}if(a=l,i=a.updateQueue,i!==null){var u=a.stateNode;try{var v=i.shared.hiddenCallbacks;if(v!==null)for(i.shared.hiddenCallbacks=null,i=0;i<v.length;i++)Hd(v[i],u)}catch(T){Re(a,a.return,T)}}s&&o&64&&Ff(l),st(l,l.return);break;case 27:(t&2)!==0&&tm(l);case 5:l.tag!==5&&l.tag!==27||em(l),Pn(i,l,t),s&&a===null&&o&4&&Gs(l),st(l,l.return);break;case 6:em(l);break;case 26:u=l.stateNode,l.memoizedState!==null||u===null||an||_c(yl(u.ownerDocument),l.type,u),Pn(i,l,t),s&&a===null&&o&4&&Gs(l),st(l,l.return);break;case 12:Pn(i,l,t);break;case 31:Pn(i,l,t),s&&o&4&&pm(i,l);break;case 13:Pn(i,l,t),s&&o&4&&gm(i,l);break;case 22:l.memoizedState===null&&Pn(i,l,t),st(l,l.return);break;case 30:Pn(i,l,t),st(l,l.return);break;case 7:st(l,l.return);default:Pn(i,l,t)}n=n.sibling}}function nc(e,n){var t=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(t=e.memoizedState.cachePool.pool),e=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(e=n.memoizedState.cachePool.pool),e!==t&&(e!=null&&e.refCount++,t!=null&&Ji(t))}function tc(e,n){e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&Ji(e))}function Xn(e,n,t,a){var i=(t&335544064)===t;if(n.subtreeFlags&(i?10262:10256))for(n=n.child;n!==null;)ym(e,n,t,a),n=n.sibling;else i&&rm(n)}function ym(e,n,t,a){var i=(t&335544064)===t;i&&n.alternate===null&&n.return!==null&&n.return.alternate!==null&&zo(n);var l=n.flags;switch(n.tag){case 0:case 11:case 15:Xn(e,n,t,a),l&2048&&sl(9,n);break;case 1:Xn(e,n,t,a);break;case 3:Xn(e,n,t,a),i&&Fs&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,e.style.viewTransitionName==="root"&&(e.style.viewTransitionName=""),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName==="none"&&(e.style.viewTransitionName="")),l&2048&&(l=null,n.alternate!==null&&(l=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==l&&(n.refCount++,l!=null&&Ji(l)));break;case 12:if(l&2048){Xn(e,n,t,a),l=n.stateNode;try{var o=n.memoizedProps,s=o.id,u=o.onPostCommit;typeof u=="function"&&u(s,n.alternate===null?"mount":"update",l.passiveEffectDuration,-0)}catch(v){Re(n,n.return,v)}}else Xn(e,n,t,a);break;case 31:Xn(e,n,t,a);break;case 13:Xn(e,n,t,a);break;case 23:break;case 22:o=n.stateNode,s=n.alternate,n.memoizedState!==null?(i&&s!==null&&s.memoizedState===null&&zo(s),o._visibility&2?Xn(e,n,t,a):dl(e,n)):(i&&s!==null&&s.memoizedState!==null&&zo(n),o._visibility&2?Xn(e,n,t,a):(o._visibility|=2,si(e,n,t,a,(n.subtreeFlags&10256)!==0||!1))),l&2048&&nc(s,n);break;case 24:Xn(e,n,t,a),l&2048&&tc(n.alternate,n);break;case 30:i&&(l=n.alternate,l!==null&&(ut(l.child,!0),ut(n.child,!0))),Xn(e,n,t,a);break;default:Xn(e,n,t,a)}}function si(e,n,t,a,i){for(i=i&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var l=e,o=n,s=t,u=a,v=o.flags;switch(o.tag){case 0:case 11:case 15:si(l,o,s,u,i),sl(8,o);break;case 23:break;case 22:var T=o.stateNode;o.memoizedState!==null?T._visibility&2?si(l,o,s,u,i):dl(l,o):(T._visibility|=2,si(l,o,s,u,i)),i&&v&2048&&nc(o.alternate,o);break;case 24:si(l,o,s,u,i),i&&v&2048&&tc(o.alternate,o);break;default:si(l,o,s,u,i)}n=n.sibling}}function dl(e,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var t=e,a=n,i=a.flags;switch(a.tag){case 22:dl(t,a),i&2048&&nc(a.alternate,a);break;case 24:dl(t,a),i&2048&&tc(a.alternate,a);break;default:dl(t,a)}n=n.sibling}}var La=8192;function za(e,n,t){if(e.subtreeFlags&La)for(e=e.child;e!==null;)xm(e,n,t),e=e.sibling}function xm(e,n,t){switch(e.tag){case 26:za(e,n,t),e.flags&La&&(e.memoizedState!==null?Ub(t,Fn,e.memoizedState,e.memoizedProps):(e=e.stateNode,(n&335544128)===n&&Cp(t,e)));break;case 5:za(e,n,t),e.flags&La&&(e=e.stateNode,(n&335544128)===n&&Cp(t,e));break;case 3:case 4:var a=Fn;Fn=yl(e.stateNode.containerInfo),za(e,n,t),Fn=a;break;case 22:e.memoizedState===null&&(a=e.alternate,a!==null&&a.memoizedState!==null?(a=La,La=16777216,za(e,n,t),La=a):za(e,n,t));break;case 30:if((e.flags&La)!==0&&(a=e.memoizedProps.name,a!=null&&a!=="auto")){var i=e.stateNode;i.paired=null,On===null&&(On=new Map),On.set(a,i)}za(e,n,t);break;default:za(e,n,t)}}function wm(e){var n=e.alternate;if(n!==null&&(e=n.child,e!==null)){n.child=null;do n=e.sibling,e.sibling=null,e=n;while(e!==null)}}function fl(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var t=0;t<n.length;t++){var a=n[t];ln=a,Em(a,e)}wm(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Sm(e),e=e.sibling}function Sm(e){switch(e.tag){case 0:case 11:case 15:fl(e),e.flags&2048&&Kt(9,e,e.return);break;case 3:fl(e);break;case 12:fl(e);break;case 22:var n=e.stateNode;e.memoizedState!==null&&n._visibility&2&&(e.return===null||e.return.tag!==13)?(n._visibility&=-3,Do(e)):fl(e);break;default:fl(e)}}function Do(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var t=0;t<n.length;t++){var a=n[t];ln=a,Em(a,e)}wm(e)}for(e=e.child;e!==null;){switch(n=e,n.tag){case 0:case 11:case 15:Kt(8,n,n.return),Do(n);break;case 22:t=n.stateNode,t._visibility&2&&(t._visibility&=-3,Do(n));break;default:Do(n)}e=e.sibling}}function Em(e,n){for(;ln!==null;){var t=ln;switch(t.tag){case 0:case 11:case 15:Kt(8,t,n);break;case 23:case 22:if(t.memoizedState!==null&&t.memoizedState.cachePool!==null){var a=t.memoizedState.cachePool.pool;a!=null&&a.refCount++}break;case 24:Ji(t.memoizedState.cache)}if(a=t.child,a!==null)a.return=t,ln=a;else e:for(t=e;ln!==null;){a=ln;var i=a.sibling,l=a.return;if(fm(a),a===t){ln=null;break e}if(i!==null){i.return=l,ln=i;break e}ln=l}}}var Dv={getCacheForType:function(e){var n=sn(Ke),t=n.data.get(e);return t===void 0&&(t=e(),n.data.set(e,t)),t},cacheSignal:function(){return sn(Ke).controller.signal}},Bv=typeof WeakMap=="function"?WeakMap:Map,Ce=0,Be=null,ve=null,xe=0,ze=0,jn=null,$t=!1,ci=!1,ac=!1,Nt=0,Xe=0,Wt=0,Ra=0,Bo=0,Dn=0,ui=0,ml=null,Sn=null,ic=!1,Io=0,Tm=0,_o=1/0,Ho=null,Ft=null,Ve=0,et=null,Oa=null,pt=0,lc=0,oc=null,Am=null,di=null,fi=null,mi=null,pl=0,Uo=null;function Bn(){return(Ce&2)!==0&&xe!==0?xe&-xe:D.T!==null?hc():Cu()}function Mm(){if(Dn===0)if((xe&536870912)===0||fe){var e=Ol;Ol<<=1,(Ol&3932160)===0&&(Ol=262144),Dn=e}else Dn=536870912;return e=cn.current,e!==null&&(e.flags|=32),Dn}function pi(e,n){if(n!=null){var t=e.stateNode,a=t.ref;a===null&&(a=t.ref=op(yt(e.memoizedProps,t))),fi===null&&(fi=[]),fi.push(n.bind(null,a))}}function En(e,n,t){(e===Be&&(ze===2||ze===9)||e.cancelPendingCommit!==null)&&(gi(e,0),Pt(e,xe,Dn,!1)),Di(e,t),((Ce&2)===0||e!==Be)&&(e===Be&&((Ce&2)===0&&(Ra|=t),Xe===4&&Pt(e,xe,Dn,!1)),gt(e))}function Cm(e,n,t){if((Ce&6)!==0)throw Error(c(327));var a=!t&&(n&127)===0&&(n&e.expiredLanes)===0||ji(e,n),i=a?Hv(e,n):sc(e,n,!0),l=a;do{if(i===0){ci&&!a&&Pt(e,n,0,!1);break}else{if(t=e.current.alternate,l&&!Iv(t)){i=sc(e,n,!1),l=!1;continue}if(i===2){if(l=n,e.errorRecoveryDisabledLanes&l)var o=0;else o=e.pendingLanes&-536870913,o=o!==0?o:o&536870912?536870912:0;if(o!==0){n=o;e:{var s=e;i=ml;var u=s.current.memoizedState.isDehydrated;if(u&&(gi(s,o).flags|=256),o=sc(s,o,!1),o!==2&&o!==6){if(ac&&!u){s.errorRecoveryDisabledLanes|=l,Ra|=l,i=4;break e}l=Sn,Sn=i,l!==null&&(Sn===null?Sn=l:Sn.push.apply(Sn,l))}i=o}if(l=!1,i!==2)continue}}if(i===1){gi(e,0),Pt(e,n,0,!0);break}e:{switch(a=e,l=i,l){case 0:case 1:throw Error(c(345));case 4:if((n&4194048)!==n&&(n&62914560)!==n)break;case 6:Pt(a,n,Dn,!$t);break e;case 2:Sn=null;break;case 3:case 5:break;default:throw Error(c(329))}if((n&62914560)===n&&(i=Io+300-Cn(),10<i)){if(Pt(a,n,Dn,!$t),Dl(a,0,!0)!==0)break e;pt=n,a.timeoutHandle=Cc(km.bind(null,a,t,Sn,Ho,ic,n,Dn,Ra,ui,$t,l,"Throttled",-0,0),i);break e}km(a,t,Sn,Ho,ic,n,Dn,Ra,ui,$t,l,null,-0,0)}}break}while(!0);gt(e)}function km(e,n,t,a,i,l,o,s,u,v,T,k,p,w){e.timeoutHandle=-1;var I=n.subtreeFlags,K=(l&335544064)===l;if(k=null,(K||I&8192||(I&16785408)===16785408)&&(k={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:lt},On=null,xm(n,l,k),K&&(I=k,K=e.containerInfo,K=(K.nodeType===9?K:K.ownerDocument).__reactViewTransition,K!=null&&(I.count++,I.waitingForViewTransition=!0,I=Sl.bind(I),K.finished.then(I,I))),I=(l&62914560)===l?Io-Cn():(l&4194048)===l?Tm-Cn():0,I=qb(k,I),I!==null)){pt=l,e.cancelPendingCommit=I(Bm.bind(null,e,n,l,t,a,i,o,s,u,v,T,k,null,p,w)),Pt(e,l,o,!v);return}Bm(e,n,l,t,a,i,o,s,u,v,T,k)}function Iv(e){for(var n=e;;){var t=n.tag;if((t===0||t===11||t===15)&&n.flags&16384&&(t=n.updateQueue,t!==null&&(t=t.stores,t!==null)))for(var a=0;a<t.length;a++){var i=t[a],l=i.getSnapshot;i=i.value;try{if(!zn(l(),i))return!1}catch{return!1}}if(t=n.child,n.subtreeFlags&16384&&t!==null)t.return=n,n=t;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function Pt(e,n,t,a){n=Su(e,n),n&=~Bo,n&=~Ra,e.suspendedLanes|=n,e.pingedLanes&=~n,a&&(e.warmLanes|=n),a=e.expirationTimes;for(var i=n;0<i;){var l=31-Nn(i),o=1<<l;a[l]=-1,i&=~o}t!==0&&Tu(e,t,n)}function qo(){return(Ce&6)===0?(gl(0),!1):!0}function rc(){if(ve!==null){if(ze===0)var e=ve.return;else e=ve,Et=xa=null,gs(e),ni=null,Fi=0,e=ve;for(;e!==null;)Wf(e.alternate,e),e=e.return;ve=null}}function gi(e,n){var t=e.timeoutHandle;return t!==-1&&(e.timeoutHandle=-1,rb(t)),t=e.cancelPendingCommit,t!==null&&(e.cancelPendingCommit=null,t()),pt=0,rc(),Be=e,ve=t=wt(e.current,null),xe=n,ze=0,jn=null,$t=!1,ci=ji(e,n),ac=!1,ui=Dn=Bo=Ra=Wt=Xe=0,Sn=ml=null,ic=!1,Nt=Su(e,n),Kl(),t}function Nm(e,n){re=null,D.H=xo,n===ei||n===lo?(n=Dd(),ze=3):n===ts?(n=Dd(),ze=4):ze=n===Ls?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,jn=n,ve===null&&(Xe=1,wo(e,qn(n,e.current)))}function Lm(){var e=cn.current;return e===null?!0:(xe&4194048)===xe?mn===null:(xe&62914560)===xe||(xe&536870912)!==0?e===mn:!1}function zm(){var e=D.H;return D.H=xo,e===null?xo:e}function Rm(){var e=D.A;return D.A=Dv,e}function Go(){Xe=4,$t||(xe&4194048)!==xe&&cn.current!==null||(ci=!0),(Wt&134217727)===0&&(Ra&134217727)===0||Be===null||Pt(Be,xe,Dn,!1)}function sc(e,n,t){var a=Ce;Ce|=2;var i=zm(),l=Rm();(Be!==e||xe!==n)&&(Ho=null,gi(e,n)),n=!1;var o=Xe;e:do try{if(ze!==0&&ve!==null){var s=ve,u=jn;switch(ze){case 8:rc(),o=6;break e;case 3:case 2:case 9:case 6:cn.current===null&&(n=!0);var v=ze;if(ze=0,jn=null,hi(e,s,u,v),t&&ci){o=0;break e}break;default:v=ze,ze=0,jn=null,hi(e,s,u,v)}}_v(),o=Xe;break}catch(T){Nm(e,T)}while(!0);return n&&e.shellSuspendCounter++,Et=xa=null,Ce=a,D.H=i,D.A=l,ve===null&&(Be=null,xe=0,Kl()),o}function _v(){for(;ve!==null;)Om(ve)}function Hv(e,n){var t=Ce;Ce|=2;var a=zm(),i=Rm();Be!==e||xe!==n?(Ho=null,_o=Cn()+500,gi(e,n)):ci=ji(e,n);e:do try{if(ze!==0&&ve!==null){n=ve;var l=jn;n:switch(ze){case 1:ze=0,jn=null,hi(e,n,l,1);break;case 2:case 9:if(Od(l)){ze=0,jn=null,jm(n);break}n=function(){ze!==2&&ze!==9||Be!==e||(ze=7),gt(e)},l.then(n,n);break e;case 3:ze=7;break e;case 4:ze=5;break e;case 7:Od(l)?(ze=0,jn=null,jm(n)):(ze=0,jn=null,hi(e,n,l,7));break;case 5:var o=null;switch(ve.tag){case 26:o=ve.memoizedState;case 5:case 27:var s=ve;if(o?Ap(o):s.stateNode.complete){ze=0,jn=null;var u=s.sibling;if(u!==null)ve=u;else{var v=s.return;v!==null?(ve=v,Vo(v)):ve=null}break n}}ze=0,jn=null,hi(e,n,l,5);break;case 6:ze=0,jn=null,hi(e,n,l,6);break;case 8:rc(),Xe=6;break e;default:throw Error(c(462))}}Uv();break}catch(T){Nm(e,T)}while(!0);return Et=xa=null,D.H=a,D.A=i,Ce=t,ve!==null?0:(Be=null,xe=0,Kl(),Xe)}function Uv(){for(;ve!==null&&!ah();)Om(ve)}function Om(e){var n=Jf(e.alternate,e,Nt);e.memoizedProps=e.pendingProps,n===null?Vo(e):ve=n}function jm(e){var n=e,t=n.alternate;switch(n.tag){case 15:case 0:n=Gf(t,n,n.pendingProps,n.type,void 0,xe);break;case 11:n=Gf(t,n,n.pendingProps,n.type.render,n.ref,xe);break;case 5:gs(n);var a=n;a===tn&&(fe?(eo(a),a.tag===5&&a.stateNode!=null&&(Ie=a.stateNode)):(eo(a),fe=!0));default:Wf(t,n),n=ve=Sd(n,Nt),n=Jf(t,n,Nt)}e.memoizedProps=e.pendingProps,n===null?Vo(e):ve=n}function hi(e,n,t,a){Et=xa=null,gs(n),ni=null,Fi=0;var i=n.return;try{if(Cv(e,i,n,t,xe)){Xe=1,wo(e,qn(t,e.current)),ve=null;return}}catch(l){if(i!==null)throw ve=i,l;Xe=1,wo(e,qn(t,e.current)),ve=null;return}n.flags&32768?(fe||a===1?e=!0:ci||(xe&536870912)!==0?e=!1:($t=e=!0,(a===2||a===9||a===3||a===6)&&(a=cn.current,a!==null&&a.tag===13&&(a.flags|=16384))),Dm(n,e)):Vo(n)}function Vo(e){var n=e;do{if((n.flags&32768)!==0){Dm(n,$t);return}e=n.return;var t=zv(n.alternate,n,Nt);if(t!==null){ve=t;return}if(n=n.sibling,n!==null){ve=n;return}ve=n=e}while(n!==null);Xe===0&&(Xe=5)}function Dm(e,n){do{var t=Rv(e.alternate,e);if(t!==null){t.flags&=32767,ve=t;return}if(t=e.return,t!==null&&(t.flags|=32768,t.subtreeFlags=0,t.deletions=null),!n&&(e=e.sibling,e!==null)){ve=e;return}ve=e=t}while(e!==null);Xe=6,ve=null}function Bm(e,n,t,a,i,l,o,s,u,v,T,k){e.cancelPendingCommit=null;do Yo();while(Ve!==0);if((Ce&6)!==0)throw Error(c(327));if(n!==null){if(n===e.current)throw Error(c(177));e===Be&&(ve=Be=null,xe=0),Oa=n,et=e,pt=t,oc=i,Am=a,qv(e,n,t,o,s,u,k)}}function qv(e,n,t,a,i,l,o){var s=n.lanes|n.childLanes;if(lc=s,s|=Vr,mh(e,t,s,a,i,l),fi=null,(t&335544064)===t?(mi=gv(e),a=10262):(mi=null,a=10256),(n.subtreeFlags&a)!==0||(n.flags&a)!==0?(e.callbackNode=null,e.callbackPriority=0,Qv(zl,function(){return fc(),null})):(e.callbackNode=null,e.callbackPriority=0),No=!1,a=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||a){a=D.T,D.T=null,i=P.p,P.p=2,l=Ce,Ce|=4;try{Ov(e,n,t)}finally{Ce=l,P.p=i,D.T=a}}Ve=1,No?di=mb(o,e.containerInfo,mi,cc,uc,Vv,dc,fc,Gv):(cc(),uc(),dc())}function Gv(e){if(Ve!==0){var n=et.onRecoverableError;n(e,{componentStack:null})}}function Vv(){Ve===3&&(Ve=0,bm(Oa,et),Ve=4)}function cc(){if(Ve===1){Ve=0;var e=et,n=Oa,t=pt,a=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||a){a=D.T,D.T=null;var i=P.p;P.p=2;var l=Ce;Ce|=4;try{ul=Ro=!1,hm(n,e,t),t=Tc;var o=fd(e.containerInfo),s=t.focusedElem,u=t.selectionRange;if(o!==s&&s&&s.ownerDocument&&dd(s.ownerDocument.documentElement,s)){if(u!==null&&_r(s)){var v=u.start,T=u.end;if(T===void 0&&(T=v),"selectionStart"in s)s.selectionStart=v,s.selectionEnd=Math.min(T,s.value.length);else{var k=s.ownerDocument||document,p=k&&k.defaultView||window;if(p.getSelection){var w=p.getSelection(),I=s.textContent.length,K=Math.min(u.start,I),se=u.end===void 0?K:Math.min(u.end,I);!w.extend&&K>se&&(o=se,se=K,K=o);var h=ud(s,K),f=ud(s,se);if(h&&f&&(w.rangeCount!==1||w.anchorNode!==h.node||w.anchorOffset!==h.offset||w.focusNode!==f.node||w.focusOffset!==f.offset)){var x=k.createRange();x.setStart(h.node,h.offset),w.removeAllRanges(),K>se?(w.addRange(x),w.extend(f.node,f.offset)):(x.setEnd(f.node,f.offset),w.addRange(x))}}}}for(k=[],w=s;w=w.parentNode;)w.nodeType===1&&k.push({element:w,left:w.scrollLeft,top:w.scrollTop});for(typeof s.focus=="function"&&s.focus(),s=0;s<k.length;s++){var C=k[s];C.element.scrollLeft=C.left,C.element.scrollTop=C.top}}Ti=!!Ec,Tc=Ec=null}finally{Ce=l,P.p=i,D.T=a}}e.current=n,Ve=2}}function uc(){if(Ve===2){Ve=0;var e=et,n=Oa,t=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||t){t=D.T,D.T=null;var a=P.p;P.p=2;var i=Ce;Ce|=4;try{um(e,n.alternate,n)}finally{Ce=i,P.p=a,D.T=t}}Ve=3}}function dc(){if(Ve===4||Ve===3){Ve=0;var e=di;di=null,ih();var n=et,t=Oa,a=pt,i=Am,l=(a&335544064)===a?10262:10256;if((t.subtreeFlags&l)!==0||(t.flags&l)!==0?Ve=5:(Ve=0,Oa=et=null,Im(n,n.pendingLanes)),l=n.pendingLanes,l===0&&(Ft=null),xr(a),t=t.stateNode,kn&&typeof kn.onCommitFiberRoot=="function")try{kn.onCommitFiberRoot(Oi,t,void 0,(t.current.flags&128)===128)}catch{}if(i!==null){t=D.T,l=P.p,P.p=2,D.T=null;try{for(var o=n.onRecoverableError,s=0;s<i.length;s++){var u=i[s];o(u.value,{componentStack:u.stack})}}finally{D.T=t,P.p=l}}if(i=fi,o=mi,mi=null,i!==null&&(fi=null,o===null&&(o=[]),e!==null))for(u=0;u<i.length;u++)t=(0,i[u])(o),t!==void 0&&e.finished.finally(t);(pt&3)!==0&&Yo(),gt(n),l=n.pendingLanes,(a&261930)!==0&&(l&42)!==0?n===Uo?pl++:(pl=0,Uo=n):(pl=0,Uo=null),gl(0)}}function Im(e,n){(e.pooledCacheLanes&=n)===0&&(n=e.pooledCache,n!=null&&(e.pooledCache=null,Ji(n)))}function Yo(){return di!==null&&(di.skipTransition(),di=null),cc(),uc(),dc(),fc()}function fc(){if(Ve!==5)return!1;var e=et,n=lc;lc=0;var t=xr(pt),a=D.T,i=P.p;try{P.p=32>t?32:t,D.T=null,t=oc,oc=null;var l=et,o=pt;if(Ve=0,Oa=et=null,pt=0,(Ce&6)!==0)throw Error(c(331));var s=Ce;if(Ce|=4,Sm(l.current),ym(l,l.current,o,t),Ce=s,gl(0,!1),kn&&typeof kn.onPostCommitFiberRoot=="function")try{kn.onPostCommitFiberRoot(Oi,l)}catch{}return!0}finally{P.p=i,D.T=a,Im(e,n)}}function _m(e,n,t){n=qn(t,n),n=Ns(e.stateNode,n,2),e=Yt(e,n,2),e!==null&&(Di(e,2),gt(e))}function Re(e,n,t){if(e.tag===3)_m(e,e,t);else for(;n!==null;){if(n.tag===3){_m(n,e,t);break}else if(n.tag===1){var a=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof a.componentDidCatch=="function"&&(Ft===null||!Ft.has(a))){e=qn(t,e),t=jf(2),a=Yt(n,t,2),a!==null&&(Df(t,a,n,e),Di(a,2),gt(a));break}}n=n.return}}function mc(e,n,t){var a=e.pingCache;if(a===null){a=e.pingCache=new Bv;var i=new Set;a.set(n,i)}else i=a.get(n),i===void 0&&(i=new Set,a.set(n,i));i.has(t)||(ac=!0,i.add(t),e=Yv.bind(null,e,n,t),n.then(e,e))}function Yv(e,n,t){var a=e.pingCache;a!==null&&a.delete(n),e.pingedLanes|=e.suspendedLanes&t,e.warmLanes&=~t,Be===e&&(xe&t)===t&&((Xe===4||Xe===3&&(xe&62914560)===xe&&300>Cn()-Io)&&(Ce&2)===0?gi(e,0):Bo|=t,ui===xe&&(ui=0)),gt(e)}function Hm(e,n){n===0&&(n=Eu()),e=va(e,n),e!==null&&(Di(e,n),gt(e))}function Xv(e){var n=e.memoizedState,t=0;n!==null&&(t=n.retryLane),Hm(e,t)}function Zv(e,n){var t=0;switch(e.tag){case 31:case 13:var a=e.stateNode,i=e.memoizedState;i!==null&&(t=i.retryLane);break;case 19:a=e.stateNode;break;case 22:a=e.stateNode._retryCache;break;default:throw Error(c(314))}a!==null&&a.delete(n),Hm(e,t)}function Qv(e,n){return hr(e,n)}var vi=null,bi=null,pc=!1,Xo=!1,gc=!1,ea=0;function gt(e){e!==bi&&e.next===null&&(bi===null?vi=bi=e:bi=bi.next=e),Xo=!0,pc||(pc=!0,Jv())}function gl(e,n){if(!gc&&Xo){gc=!0;do for(var t=!1,a=vi;a!==null;){if(e!==0){var i=a.pendingLanes;if(i===0)var l=0;else{var o=a.suspendedLanes,s=a.pingedLanes;l=(1<<31-Nn(42|e)+1)-1,l&=i&~(o&~s),l=l&201326741?l&201326741|1:l?l|2:0}l!==0&&(t=!0,Vm(a,l))}else l=xe,l=Dl(a,a===Be?l:0,a.cancelPendingCommit!==null||a.timeoutHandle!==-1),(l&3)===0||ji(a,l)||(t=!0,Vm(a,l));a=a.next}while(t);gc=!1}}function Kv(){Um()}function Um(){Xo=pc=!1;var e=0;ea!==0&&ob()&&(e=ea);for(var n=Cn(),t=null,a=vi;a!==null;){var i=a.next,l=qm(a,n);l===0?(a.next=null,t===null?vi=i:t.next=i,i===null&&(bi=t)):(t=a,(e!==0||(l&3)!==0)&&(Xo=!0)),a=i}Ve!==0&&Ve!==5||gl(e),ea!==0&&(ea=0)}function qm(e,n){for(var t=e.suspendedLanes,a=e.pingedLanes,i=e.expirationTimes,l=e.pendingLanes&-62914561;0<l;){var o=31-Nn(l),s=1<<o,u=i[o];u===-1?((s&t)===0||(s&a)!==0)&&(i[o]=fh(s,n)):u<=n&&(e.expiredLanes|=s),l&=~s}if(n=Be,t=xe,t=Dl(e,e===n?t:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),a=e.callbackNode,t===0||e===n&&(ze===2||ze===9)||e.cancelPendingCommit!==null)return a!==null&&a!==null&&vr(a),e.callbackNode=null,e.callbackPriority=0;if((t&3)===0||ji(e,t)){if(n=t&-t,n===e.callbackPriority)return n;switch(a!==null&&vr(a),xr(t)){case 2:case 8:t=xu;break;case 32:t=zl;break;case 268435456:t=wu;break;default:t=zl}return a=Gm.bind(null,e),t=hr(t,a),e.callbackPriority=n,e.callbackNode=t,n}return a!==null&&a!==null&&vr(a),e.callbackPriority=2,e.callbackNode=null,2}function Gm(e,n){if(Ve!==0&&Ve!==5)return e.callbackNode=null,e.callbackPriority=0,null;var t=e.callbackNode;if(Yo()&&e.callbackNode!==t)return null;var a=xe;return a=Dl(e,e===Be?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),a===0?null:(Cm(e,a,n),qm(e,Cn()),e.callbackNode!=null&&e.callbackNode===t?Gm.bind(null,e):null)}function Vm(e,n){if(Yo())return null;Cm(e,n,!0)}function Jv(){sb(function(){(Ce&6)!==0?hr(yu,Kv):Um()})}function hc(){if(ea===0){var e=Ea;e===0&&(e=Rl,Rl<<=1,(Rl&261888)===0&&(Rl=256)),ea=e}return ea}function Ym(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Ul(e)}function $v(e,n,t,a,i){if(n==="submit"&&t&&t.stateNode===i){var l=Ym((i[bn]||null).action),o=a.submitter;o&&(n=(n=o[bn]||null)?Ym(n.formAction):o.getAttribute("formAction"),n!==null&&(l=n,o=null));var s=new Yl("action","action",null,a,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(a.defaultPrevented){if(ea!==0){var u=new FormData(i,o);Ts(t,{pending:!0,data:u,method:i.method,action:l},null,u)}}else typeof l=="function"&&(s.preventDefault(),u=new FormData(i,o),Ts(t,{pending:!0,data:u,method:i.method,action:l},l,u))},currentTarget:i}]})}}for(var vc=0;vc<Gr.length;vc++){var bc=Gr[vc],Wv=bc.toLowerCase(),Fv=bc[0].toUpperCase()+bc.slice(1);$n(Wv,"on"+Fv)}$n(gd,"onAnimationEnd"),$n(hd,"onAnimationIteration"),$n(vd,"onAnimationStart"),$n("dblclick","onDoubleClick"),$n("focusin","onFocus"),$n("focusout","onBlur"),$n(rv,"onTransitionRun"),$n(sv,"onTransitionStart"),$n(cv,"onTransitionCancel"),$n(bd,"onTransitionEnd"),Ua("onMouseEnter",["mouseout","mouseover"]),Ua("onMouseLeave",["mouseout","mouseover"]),Ua("onPointerEnter",["pointerout","pointerover"]),Ua("onPointerLeave",["pointerout","pointerover"]),pa("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),pa("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),pa("onBeforeInput",["compositionend","keypress","textInput","paste"]),pa("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),pa("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),pa("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var hl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Pv=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(hl));function Xm(e,n){n=(n&4)!==0;for(var t=0;t<e.length;t++){var a=e[t],i=a.event;a=a.listeners;e:{var l=void 0;if(n)for(var o=a.length-1;0<=o;o--){var s=a[o],u=s.instance,v=s.currentTarget;if(s=s.listener,u!==l&&i.isPropagationStopped())break e;l=s,i.currentTarget=v;try{l(i)}catch(T){Ql(T)}i.currentTarget=null,l=u}else for(o=0;o<a.length;o++){if(s=a[o],u=s.instance,v=s.currentTarget,s=s.listener,u!==l&&i.isPropagationStopped())break e;l=s,i.currentTarget=v;try{l(i)}catch(T){Ql(T)}i.currentTarget=null,l=u}}}}function be(e,n){var t=n[Nu];t===void 0&&(t=n[Nu]=new Set);var a=e+"__bubble";t.has(a)||(Zm(n,e,2,!1),t.add(a))}function yc(e,n,t){var a=0;n&&(a|=4),Zm(t,e,a,n)}var Zo="_reactListening"+Math.random().toString(36).slice(2);function xc(e){if(!e[Zo]){e[Zo]=!0,Ru.forEach(function(t){t!=="selectionchange"&&(Pv.has(t)||yc(t,!1,e),yc(t,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[Zo]||(n[Zo]=!0,yc("selectionchange",!1,n))}}function Zm(e,n,t,a){switch(Dp(n)){case 2:var i=Xb;break;case 8:i=Zb;break;default:i=Uc}t=i.bind(null,n,t,e),i=void 0,!kr||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(i=!0),a?i!==void 0?e.addEventListener(n,t,{capture:!0,passive:i}):e.addEventListener(n,t,!0):i!==void 0?e.addEventListener(n,t,{passive:i}):e.addEventListener(n,t,!1)}function wc(e,n,t,a,i){var l=a;if((n&1)===0&&(n&2)===0&&a!==null)e:for(;;){if(a===null)return;var o=a.tag;if(o===3||o===4){var s=a.stateNode.containerInfo;if(s===i)break;if(o===4)for(o=a.return;o!==null;){var u=o.tag;if((u===3||u===4)&&o.stateNode.containerInfo===i)return;o=o.return}for(;s!==null;){if(o=ma(s),o===null)return;if(u=o.tag,u===5||u===6||u===26||u===27){a=l=o;continue e}s=s.parentNode}}a=a.return}Xu(function(){var v=l,T=Mr(t),k=[];e:{var p=yd.get(e);if(p!==void 0){var w=Yl,I=e;switch(e){case"keypress":if(Gl(t)===0)break e;case"keydown":case"keyup":w=Ih;break;case"focusin":I="focus",w=Rr;break;case"focusout":I="blur",w=Rr;break;case"beforeblur":case"afterblur":w=Rr;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":w=Ku;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":w=Ah;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":w=Gh;break;case gd:case hd:case vd:w=kh;break;case bd:w=Yh;break;case"scroll":case"scrollend":w=Eh;break;case"wheel":w=Zh;break;case"copy":case"cut":case"paste":w=Lh;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":w=$u;break;case"submit":w=Uh;break;case"toggle":case"beforetoggle":w=Kh}var K=(n&4)!==0,se=!K&&(e==="scroll"||e==="scrollend"),h=K?p!==null?p+"Capture":null:p;K=[];for(var f=v,x;f!==null;){var C=f;if(x=C.stateNode,C=C.tag,C!==5&&C!==26&&C!==27||x===null||h===null||(C=_i(f,h),C!=null&&K.push(vl(f,C,x))),se)break;f=f.return}0<K.length&&(p=new w(p,I,null,t,T),k.push({event:p,listeners:K}))}}if((n&7)===0){e:{if(w=e==="mouseover"||e==="pointerover",p=e==="mouseout"||e==="pointerout",w&&t!==Ar&&(I=t.relatedTarget||t.fromElement)&&(ma(I)||I[Ia]))break e;(p||w)&&(I=T.window===T?T:(w=T.ownerDocument)?w.defaultView||w.parentWindow:window,p?(w=t.relatedTarget||t.toElement,p=v,w=w?ma(w):null,w!==null&&(se=M(w),K=w.tag,w!==se||K!==5&&K!==27&&K!==6)&&(w=null)):(p=null,w=v),p!==w&&(K=Ku,C="onMouseLeave",h="onMouseEnter",f="mouse",(e==="pointerout"||e==="pointerover")&&(K=$u,C="onPointerLeave",h="onPointerEnter",f="pointer"),se=p==null?I:Ii(p),x=w==null?I:Ii(w),I=new K(C,f+"leave",p,t,T),I.target=se,I.relatedTarget=x,C=null,ma(T)===v&&(K=new K(h,f+"enter",w,t,T),K.target=x,K.relatedTarget=se,C=K),se=C,K=p&&w?Ne(p,w,eb):null,p!==null&&Qm(k,I,p,K,!1),w!==null&&se!==null&&Qm(k,se,w,K,!0)))}e:{if(p=v?Ii(v):window,w=p.nodeName&&p.nodeName.toLowerCase(),w==="select"||w==="input"&&p.type==="file")var V=id;else if(td(p))if(ld)V=iv;else{V=tv;var we=nv}else w=p.nodeName,!w||w.toLowerCase()!=="input"||p.type!=="checkbox"&&p.type!=="radio"?v&&Tr(v.elementType)&&(V=id):V=av;if(V&&(V=V(e,v))){ad(k,V,t,T);break e}we&&we(e,p,v)}switch(we=v?Ii(v):window,e){case"focusin":(td(we)||we.contentEditable==="true")&&(Za=we,Hr=v,Zi=null);break;case"focusout":Zi=Hr=Za=null;break;case"mousedown":Ur=!0;break;case"contextmenu":case"mouseup":case"dragend":Ur=!1,md(k,t,T);break;case"selectionchange":if(ov)break;case"keydown":case"keyup":md(k,t,T)}var W;if(jr)e:{switch(e){case"compositionstart":var ne="onCompositionStart";break e;case"compositionend":ne="onCompositionEnd";break e;case"compositionupdate":ne="onCompositionUpdate";break e}ne=void 0}else Xa?ed(e,t)&&(ne="onCompositionEnd"):e==="keydown"&&t.keyCode===229&&(ne="onCompositionStart");ne&&(Wu&&t.locale!=="ko"&&(Xa||ne!=="onCompositionStart"?ne==="onCompositionEnd"&&Xa&&(W=Zu()):(Dt=T,Nr="value"in Dt?Dt.value:Dt.textContent,Xa=!0)),we=Qo(v,ne),0<we.length&&(ne=new Ju(ne,e,null,t,T),k.push({event:ne,listeners:we}),W?ne.data=W:(W=nd(t),W!==null&&(ne.data=W)))),(W=$h?Wh(e,t):Fh(e,t))&&(ne=Qo(v,"onBeforeInput"),0<ne.length&&(we=new Ju("onBeforeInput","beforeinput",null,t,T),k.push({event:we,listeners:ne}),we.data=W)),$v(k,e,v,t,T)}Xm(k,n)})}function vl(e,n,t){return{instance:e,listener:n,currentTarget:t}}function Qo(e,n){for(var t=n+"Capture",a=[];e!==null;){var i=e,l=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||l===null||(i=_i(e,t),i!=null&&a.unshift(vl(e,i,l)),i=_i(e,n),i!=null&&a.push(vl(e,i,l))),e.tag===3)return a;e=e.return}return[]}function eb(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Qm(e,n,t,a,i){for(var l=n._reactName,o=[];t!==null&&t!==a;){var s=t,u=s.alternate,v=s.stateNode;if(s=s.tag,u!==null&&u===a)break;s!==5&&s!==26&&s!==27||v===null||(u=v,i?(v=_i(t,l),v!=null&&o.unshift(vl(t,v,u))):i||(v=_i(t,l),v!=null&&o.push(vl(t,v,u)))),t=t.return}o.length!==0&&e.push({event:n,listeners:o})}var nb=/\r\n?/g,tb=/\u0000|\uFFFD/g;function Km(e){return(typeof e=="string"?e:""+e).replace(nb,`
`).replace(tb,"")}function Jm(e,n){return n=Km(n),Km(e)===n}function Oe(e,n,t,a,i,l){switch(t){case"children":if(typeof a=="string")n==="body"||n==="textarea"&&a===""||Ga(e,a);else if(typeof a=="number"||typeof a=="bigint")n!=="body"&&Ga(e,""+a);else return;break;case"className":Hl(e,"class",a);break;case"tabIndex":Hl(e,"tabindex",a);break;case"dir":case"role":case"viewBox":case"width":case"height":Hl(e,t,a);break;case"style":Vu(e,a,l);return;case"data":if(n!=="object"){Hl(e,"data",a);break}case"src":case"href":if(a===""&&(n!=="a"||t!=="href")){e.removeAttribute(t);break}if(a==null||typeof a=="function"||typeof a=="symbol"||typeof a=="boolean"){e.removeAttribute(t);break}a=Ul(a),e.setAttribute(t,a);break;case"action":case"formAction":if(typeof a=="function"){e.setAttribute(t,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof l=="function"&&(t==="formAction"?(n!=="input"&&Oe(e,n,"name",i.name,i,null),Oe(e,n,"formEncType",i.formEncType,i,null),Oe(e,n,"formMethod",i.formMethod,i,null),Oe(e,n,"formTarget",i.formTarget,i,null)):(Oe(e,n,"encType",i.encType,i,null),Oe(e,n,"method",i.method,i,null),Oe(e,n,"target",i.target,i,null)));if(a==null||typeof a=="symbol"||typeof a=="boolean"){e.removeAttribute(t);break}a=Ul(a),e.setAttribute(t,a);break;case"onClick":a!=null&&(e.onclick=lt);return;case"onScroll":a!=null&&be("scroll",e);return;case"onScrollEnd":a!=null&&be("scrollend",e);return;case"dangerouslySetInnerHTML":if(a!=null){if(typeof a!="object"||!("__html"in a))throw Error(c(61));if(t=a.__html,t!=null){if(i.children!=null)throw Error(c(60));l?.__html!==t&&(e.innerHTML=t)}}break;case"multiple":e.multiple=a&&typeof a!="function"&&typeof a!="symbol";break;case"muted":e.muted=a&&typeof a!="function"&&typeof a!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(a==null||typeof a=="function"||typeof a=="boolean"||typeof a=="symbol"){e.removeAttribute("xlink:href");break}t=Ul(a),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",t);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":a!=null&&typeof a!="function"&&typeof a!="symbol"?e.setAttribute(t,a):e.removeAttribute(t);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":a&&typeof a!="function"&&typeof a!="symbol"?e.setAttribute(t,""):e.removeAttribute(t);break;case"capture":case"download":a===!0?e.setAttribute(t,""):a!==!1&&a!=null&&typeof a!="function"&&typeof a!="symbol"?e.setAttribute(t,a):e.removeAttribute(t);break;case"cols":case"rows":case"size":case"span":a!=null&&typeof a!="function"&&typeof a!="symbol"&&!isNaN(a)&&1<=a?e.setAttribute(t,a):e.removeAttribute(t);break;case"rowSpan":case"start":a==null||typeof a=="function"||typeof a=="symbol"||isNaN(a)?e.removeAttribute(t):e.setAttribute(t,a);break;case"popover":be("beforetoggle",e),be("toggle",e),_l(e,"popover",a);break;case"xlinkActuate":vt(e,"http://www.w3.org/1999/xlink","xlink:actuate",a);break;case"xlinkArcrole":vt(e,"http://www.w3.org/1999/xlink","xlink:arcrole",a);break;case"xlinkRole":vt(e,"http://www.w3.org/1999/xlink","xlink:role",a);break;case"xlinkShow":vt(e,"http://www.w3.org/1999/xlink","xlink:show",a);break;case"xlinkTitle":vt(e,"http://www.w3.org/1999/xlink","xlink:title",a);break;case"xlinkType":vt(e,"http://www.w3.org/1999/xlink","xlink:type",a);break;case"xmlBase":vt(e,"http://www.w3.org/XML/1998/namespace","xml:base",a);break;case"xmlLang":vt(e,"http://www.w3.org/XML/1998/namespace","xml:lang",a);break;case"xmlSpace":vt(e,"http://www.w3.org/XML/1998/namespace","xml:space",a);break;case"is":_l(e,"is",a);break;case"innerText":case"textContent":return;default:if(!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")t=wh.get(t)||t,_l(e,t,a);else return}Ae=!0}function Sc(e,n,t,a,i,l){switch(t){case"style":Vu(e,a,l);return;case"dangerouslySetInnerHTML":if(a!=null){if(typeof a!="object"||!("__html"in a))throw Error(c(61));if(t=a.__html,t!=null){if(i.children!=null)throw Error(c(60));l?.__html!==t&&(e.innerHTML=t)}}break;case"children":if(typeof a=="string")Ga(e,a);else if(typeof a=="number"||typeof a=="bigint")Ga(e,""+a);else return;break;case"onScroll":a!=null&&be("scroll",e);return;case"onScrollEnd":a!=null&&be("scrollend",e);return;case"onClick":a!=null&&(e.onclick=lt);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!Ou.hasOwnProperty(t))e:{if(t[0]==="o"&&t[1]==="n"&&(i=t.endsWith("Capture"),l=t.slice(2,i?t.length-7:void 0),n=e[bn]||null,n=n!=null?n[t]:null,typeof n=="function"&&e.removeEventListener(l,n,i),typeof a=="function")){typeof n!="function"&&n!==null&&(t in e?e[t]=null:e.hasAttribute(t)&&e.removeAttribute(t)),e.addEventListener(l,a,i);break e}Ae=!0,t in e?e[t]=a:a===!0?e.setAttribute(t,""):_l(e,t,a)}return}Ae=!0}function fn(e,n,t){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":be("error",e),be("load",e);var a=!1,i=!1,l;for(l in t)if(t.hasOwnProperty(l)){var o=t[l];if(o!=null)switch(l){case"src":a=!0;break;case"srcSet":i=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(c(137,n));default:Oe(e,n,l,o,t,null)}}i&&Oe(e,n,"srcSet",t.srcSet,t,null),a&&Oe(e,n,"src",t.src,t,null);return;case"input":be("invalid",e);var s=l=o=i=null,u=null,v=null;for(a in t)if(t.hasOwnProperty(a)){var T=t[a];if(T!=null)switch(a){case"name":i=T;break;case"type":o=T;break;case"checked":u=T;break;case"defaultChecked":v=T;break;case"value":l=T;break;case"defaultValue":s=T;break;case"children":case"dangerouslySetInnerHTML":if(T!=null)throw Error(c(137,n));break;default:Oe(e,n,a,T,t,null)}}Hu(e,l,s,u,v,o,i,!1);return;case"select":be("invalid",e),a=o=l=null;for(i in t)if(t.hasOwnProperty(i)&&(s=t[i],s!=null))switch(i){case"value":l=s;break;case"defaultValue":o=s;break;case"multiple":a=s;default:Oe(e,n,i,s,t,null)}n=l,t=o,e.multiple=!!a,n!=null?qa(e,!!a,n,!1):t!=null&&qa(e,!!a,t,!0);return;case"textarea":be("invalid",e),l=i=a=null;for(o in t)if(t.hasOwnProperty(o)&&(s=t[o],s!=null))switch(o){case"value":a=s;break;case"defaultValue":i=s;break;case"children":l=s;break;case"dangerouslySetInnerHTML":if(s!=null)throw Error(c(91));break;default:Oe(e,n,o,s,t,null)}qu(e,a,i,l);return;case"option":for(u in t)t.hasOwnProperty(u)&&(a=t[u],a!=null)&&(u==="selected"?e.selected=a&&typeof a!="function"&&typeof a!="symbol":Oe(e,n,u,a,t,null));return;case"dialog":be("beforetoggle",e),be("toggle",e),be("cancel",e),be("close",e);break;case"iframe":case"object":be("load",e);break;case"video":case"audio":for(a=0;a<hl.length;a++)be(hl[a],e);break;case"image":be("error",e),be("load",e);break;case"details":be("toggle",e);break;case"embed":case"source":case"link":be("error",e),be("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(v in t)if(t.hasOwnProperty(v)&&(a=t[v],a!=null))switch(v){case"children":case"dangerouslySetInnerHTML":throw Error(c(137,n));default:Oe(e,n,v,a,t,null)}return;default:if(Tr(n)){for(T in t)t.hasOwnProperty(T)&&(a=t[T],a!==void 0&&Sc(e,n,T,a,t,void 0));return}}for(s in t)t.hasOwnProperty(s)&&(a=t[s],a!=null&&Oe(e,n,s,a,t,null))}var ab={};function ib(e,n,t,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var i=null,l=null,o=null,s=null,u=null,v=null,T=null;for(w in t){var k=t[w];if(t.hasOwnProperty(w)&&k!=null)switch(w){case"checked":break;case"value":break;case"defaultValue":u=k;default:a.hasOwnProperty(w)||Oe(e,n,w,null,a,k)}}for(var p in a){var w=a[p];if(k=t[p],a.hasOwnProperty(p)&&(w!=null||k!=null))switch(p){case"type":w!==k&&(Ae=!0),l=w;break;case"name":w!==k&&(Ae=!0),i=w;break;case"checked":w!==k&&(Ae=!0),v=w;break;case"defaultChecked":w!==k&&(Ae=!0),T=w;break;case"value":w!==k&&(Ae=!0),o=w;break;case"defaultValue":w!==k&&(Ae=!0),s=w;break;case"children":case"dangerouslySetInnerHTML":if(w!=null)throw Error(c(137,n));break;default:w!==k&&Oe(e,n,p,w,a,k)}}Sr(e,o,s,u,v,T,l,i);return;case"select":w=o=s=p=null;for(l in t)if(u=t[l],t.hasOwnProperty(l)&&u!=null)switch(l){case"value":break;case"multiple":w=u;default:a.hasOwnProperty(l)||Oe(e,n,l,null,a,u)}for(i in a)if(l=a[i],u=t[i],a.hasOwnProperty(i)&&(l!=null||u!=null))switch(i){case"value":l!==u&&(Ae=!0),p=l;break;case"defaultValue":l!==u&&(Ae=!0),s=l;break;case"multiple":l!==u&&(Ae=!0),o=l;default:l!==u&&Oe(e,n,i,l,a,u)}n=s,t=o,a=w,p!=null?qa(e,!!t,p,!1):!!a!=!!t&&(n!=null?qa(e,!!t,n,!0):qa(e,!!t,t?[]:"",!1));return;case"textarea":w=p=null;for(s in t)if(i=t[s],t.hasOwnProperty(s)&&i!=null&&!a.hasOwnProperty(s))switch(s){case"value":break;case"children":break;default:Oe(e,n,s,null,a,i)}for(o in a)if(i=a[o],l=t[o],a.hasOwnProperty(o)&&(i!=null||l!=null))switch(o){case"value":i!==l&&(Ae=!0),p=i;break;case"defaultValue":i!==l&&(Ae=!0),w=i;break;case"children":break;case"dangerouslySetInnerHTML":if(i!=null)throw Error(c(91));break;default:i!==l&&Oe(e,n,o,i,a,l)}Uu(e,p,w);return;case"option":for(var I in t)p=t[I],t.hasOwnProperty(I)&&p!=null&&!a.hasOwnProperty(I)&&(I==="selected"?e.selected=!1:Oe(e,n,I,null,a,p));for(u in a)p=a[u],w=t[u],a.hasOwnProperty(u)&&p!==w&&(p!=null||w!=null)&&(u==="selected"?(p!==w&&(Ae=!0),e.selected=p&&typeof p!="function"&&typeof p!="symbol"):Oe(e,n,u,p,a,w));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var K in t)p=t[K],t.hasOwnProperty(K)&&p!=null&&!a.hasOwnProperty(K)&&Oe(e,n,K,null,a,p);for(v in a)if(p=a[v],w=t[v],a.hasOwnProperty(v)&&p!==w&&(p!=null||w!=null))switch(v){case"children":case"dangerouslySetInnerHTML":if(p!=null)throw Error(c(137,n));break;default:Oe(e,n,v,p,a,w)}return;default:if(Tr(n)){for(var se in t)p=t[se],t.hasOwnProperty(se)&&p!==void 0&&!a.hasOwnProperty(se)&&Sc(e,n,se,void 0,a,p);for(T in a)p=a[T],w=t[T],!a.hasOwnProperty(T)||p===w||p===void 0&&w===void 0||Sc(e,n,T,p,a,w);return}}for(var h in t)p=t[h],t.hasOwnProperty(h)&&p!=null&&!a.hasOwnProperty(h)&&Oe(e,n,h,null,a,p);for(k in a)p=a[k],w=t[k],!a.hasOwnProperty(k)||p===w||p==null&&w==null||Oe(e,n,k,p,a,w)}function $m(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function lb(){if(typeof performance.getEntriesByType=="function"){for(var e=0,n=0,t=performance.getEntriesByType("resource"),a=0;a<t.length;a++){var i=t[a],l=i.transferSize,o=i.initiatorType,s=i.duration;if(l&&s&&$m(o)){for(o=0,s=i.responseEnd,a+=1;a<t.length;a++){var u=t[a],v=u.startTime;if(v>s)break;var T=u.transferSize,k=u.initiatorType;T&&$m(k)&&(u=u.responseEnd,o+=T*(u<s?1:(s-v)/(u-v)))}if(--a,n+=8*(l+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return n/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Ec=null,Tc=null;function bl(e){return e.nodeType===9?e:e.ownerDocument}function Wm(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Fm(e,n){if(e===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&n==="foreignObject"?0:e}function Pm(e,n,t,a){return t=bl(t).createElement(e),t[rn]=a,t[bn]=n,fn(t,e,n),nn(t),t}function Ac(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var Mc=null;function ob(){var e=window.event;return e&&e.type==="popstate"?e===Mc?!1:(Mc=e,!0):(Mc=null,!1)}var Cc=typeof setTimeout=="function"?setTimeout:void 0,rb=typeof clearTimeout=="function"?clearTimeout:void 0,ep=typeof Promise=="function"?Promise:void 0,np=typeof requestAnimationFrame=="function"?requestAnimationFrame:Cc,sb=typeof queueMicrotask=="function"?queueMicrotask:typeof ep<"u"?function(e){return ep.resolve(null).then(e).catch(cb)}:Cc;function cb(e){setTimeout(function(){throw e})}function na(e){return e==="head"}function tp(e,n){var t=n,a=0;do{var i=t.nextSibling;if(e.removeChild(t),i&&i.nodeType===8)if(t=i.data,t==="/$"||t==="/&"){if(a===0){e.removeChild(i),Ai(n);return}a--}else if(t==="$"||t==="$?"||t==="$~"||t==="$!"||t==="&")a++;else if(t==="html")Dc(e.ownerDocument.documentElement);else if(t==="head"){t=e.ownerDocument.head,Dc(t);for(var l=t.firstChild;l;){var o=l.nextSibling,s=l.nodeName;l[Bi]||s==="SCRIPT"||s==="STYLE"||s==="LINK"&&l.rel.toLowerCase()==="stylesheet"||t.removeChild(l),l=o}}else t==="body"&&Dc(e.ownerDocument.body);t=i}while(t);Ai(n)}function ap(e,n){var t=e;e=0;do{var a=t.nextSibling;if(t.nodeType===1?n?(t._stashedDisplay=t.style.display,t.style.display="none"):(t.style.display=t._stashedDisplay||"",t.getAttribute("style")===""&&t.removeAttribute("style")):t.nodeType===3&&(n?(t._stashedText=t.nodeValue,t.nodeValue=""):t.nodeValue=t._stashedText||""),a&&a.nodeType===8)if(t=a.data,t==="/$"){if(e===0)break;e--}else t!=="$"&&t!=="$?"&&t!=="$~"&&t!=="$!"||e++;t=a}while(t)}function ip(e,n,t){if(n=CSS.escape(n)!==n?"r-"+btoa(n).replace(/=/g,""):n,e.style.viewTransitionName=n,t!=null&&(e.style.viewTransitionClass=t),t=getComputedStyle(e),t.display==="inline"){if(n=e.getClientRects(),n.length===1)var a=1;else for(var i=a=0;i<n.length;i++){var l=n[i];0<l.width&&0<l.height&&a++}a===1&&(e=e.style,e.display=n.length===1?"inline-block":"block",e.marginTop="-"+t.paddingTop,e.marginBottom="-"+t.paddingBottom)}}function lp(e,n){e=e.style,n=n.style;var t=n!=null?n.hasOwnProperty("viewTransitionName")?n.viewTransitionName:n.hasOwnProperty("view-transition-name")?n["view-transition-name"]:null:null;e.viewTransitionName=t==null||typeof t=="boolean"?"":(""+t).trim(),t=n!=null?n.hasOwnProperty("viewTransitionClass")?n.viewTransitionClass:n.hasOwnProperty("view-transition-class")?n["view-transition-class"]:null:null,e.viewTransitionClass=t==null||typeof t=="boolean"?"":(""+t).trim(),e.display==="inline-block"&&(n==null?e.display=e.margin="":(t=n.display,e.display=t==null||typeof t=="boolean"?"":t,t=n.margin,t!=null?e.margin=t:(t=n.hasOwnProperty("marginTop")?n.marginTop:n["margin-top"],e.marginTop=t==null||typeof t=="boolean"?"":t,n=n.hasOwnProperty("marginBottom")?n.marginBottom:n["margin-bottom"],e.marginBottom=n==null||typeof n=="boolean"?"":n)))}function ub(e,n,t){return t=t.ownerDocument.defaultView,{rect:e,abs:n.position==="absolute"||n.position==="fixed",clip:n.clipPath!=="none"||n.overflow!=="visible"||n.filter!=="none"||n.mask!=="none"||n.mask!=="none"||n.borderRadius!=="0px",view:0<=e.bottom&&0<=e.right&&e.top<=t.innerHeight&&e.left<=t.innerWidth}}function kc(e){var n=e.getBoundingClientRect(),t=getComputedStyle(e);return ub(n,t,e)}function db(e){return e.documentElement.clientHeight}function fb(e){this.addEventListener("load",e),this.addEventListener("error",e)}function mb(e,n,t,a,i,l,o,s,u){var v=n.nodeType===9?n:n.ownerDocument;try{var T=v.startViewTransition({update:function(){var p=v.defaultView,w=p.navigation&&p.navigation.transition,I=v.fonts.status;a();var K=[];if(I==="loaded"&&(db(v),v.fonts.status==="loading"&&K.push(v.fonts.ready)),I=K.length,e!==null)for(var se=e.suspenseyImages,h=0,f=0;f<se.length;f++){var x=se[f];if(!x.complete){var C=x.getBoundingClientRect();if(0<C.bottom&&0<C.right&&C.top<p.innerHeight&&C.left<p.innerWidth){if(h+=Mp(x),h>$o){K.length=I;break}x=new Promise(fb.bind(x)),K.push(x)}}}if(0<K.length)return p=Promise.race([Promise.all(K),new Promise(function(V){return setTimeout(V,500)})]).then(i,i),(w?Promise.allSettled([w.finished,p]):p).then(l,l);if(i(),w)return w.finished.then(l,l);l()},types:t});v.__reactViewTransition=T;var k=[];return T.ready.then(function(){for(var p=v.documentElement.getAnimations({subtree:!0}),w=0;w<p.length;w++){var I=p[w],K=I.effect,se=K.pseudoElement;if(se!=null&&se.startsWith("::view-transition")){k.push(I),I=K.getKeyframes();for(var h=se=void 0,f=!0,x=0;x<I.length;x++){var C=I[x],V=C.width;if(se===void 0)se=V;else if(se!==V){f=!1;break}if(V=C.height,h===void 0)h=V;else if(h!==V){f=!1;break}delete C.width,delete C.height,C.transform==="none"&&delete C.transform}f&&se!==void 0&&h!==void 0&&(K.setKeyframes(I),f=getComputedStyle(K.target,K.pseudoElement),f.width!==se||f.height!==h)&&(f=I[0],f.width=se,f.height=h,f=I[I.length-1],f.width=se,f.height=h,K.setKeyframes(I))}}o()},function(p){v.__reactViewTransition===T&&(v.__reactViewTransition=null);try{typeof p=="object"&&p!==null&&p.name==="InvalidStateError"&&(p.message==="View transition was skipped because document visibility state is hidden."||p.message==="Skipping view transition because document visibility state has become hidden."||p.message==="Skipping view transition because viewport size changed."||p.message==="Transition was aborted because of invalid state")&&(p=null),p!==null&&u(p)}finally{a(),i(),o()}}),T.finished.finally(function(){for(var p=0;p<k.length;p++)k[p].cancel();v.__reactViewTransition===T&&(v.__reactViewTransition=null),s()}),T}catch{return a(),i(),o(),null}}function ja(e,n){this._scope=document.documentElement,this._selector="::view-transition-"+e+"("+n+")"}ja.prototype.animate=function(e,n){return n=typeof n=="number"?{duration:n}:Y({},n),n.pseudoElement=this._selector,this._scope.animate(e,n)},ja.prototype.getAnimations=function(){for(var e=this._scope,n=this._selector,t=e.getAnimations({subtree:!0}),a=[],i=0;i<t.length;i++){var l=t[i].effect;l!==null&&l.target===e&&l.pseudoElement===n&&a.push(t[i])}return a},ja.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function op(e){return{name:e,group:new ja("group",e),imagePair:new ja("image-pair",e),old:new ja("old",e),new:new ja("new",e)}}function In(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}In.prototype.addEventListener=function(e,n,t){var a=null,i=null;if(!(t!=null&&typeof t!="boolean"&&(a=t.signal||null,a!==null&&a.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var l=this._eventListeners;if(sp(l,e,n,t)===-1){var o=this,s=n;t!=null&&typeof t!="boolean"&&t.once===!0&&(s=function(u){o.removeEventListener(e,n,t),typeof n=="function"?n.call(this,u):n.handleEvent(u)}),a!==null&&(i=o.removeEventListener.bind(o,e,n,t),a.addEventListener("abort",i,{once:!0}),i=a.removeEventListener.bind(a,"abort",i)),a=yi(t),l.push({type:e,listener:n,optionsOrUseCapture:t,attachedListener:s,cleanup:i}),y(this._fragmentFiber.child,!1,pb,e,s,a)}this._eventListeners=l}};function pb(e,n,t,a){return Q(e).addEventListener(n,t,a),!1}In.prototype.removeEventListener=function(e,n,t){var a=this._eventListeners;if(a!==null&&(n=sp(a,e,n,t),n!==-1)){var i=a[n];t=i.attachedListener;var l=i.cleanup;i=yi(i.optionsOrUseCapture),y(this._fragmentFiber.child,!1,gb,e,t,i),a.splice(n,1),l!==null&&l()}};function gb(e,n,t,a){return Q(e).removeEventListener(n,t,a),!1}function yi(e){return e!=null&&typeof e!="boolean"&&(e.once===!0||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function rp(e){return e==null?"c=0":typeof e=="boolean"?"c="+(e?"1":"0"):"c="+(e.capture?"1":"0")}function sp(e,n,t,a){if(e.length===0)return-1;a=rp(a);for(var i=0;i<e.length;i++){var l=e[i];if(l.type===n&&l.listener===t&&rp(l.optionsOrUseCapture)===a)return i}return-1}In.prototype.dispatchEvent=function(e){var n=Z(this._fragmentFiber);if(n===null)return!0;n=Q(n);var t=this._eventListeners;if(t!==null&&0<t.length||!e.bubbles){var a=n.nodeType===9?n.createComment(""):document.createTextNode("");if(t)for(var i=0;i<t.length;i++){var l=t[i];a.addEventListener(l.type,l.attachedListener,yi(l.optionsOrUseCapture))}if(n.appendChild(a),e=a.dispatchEvent(e),t)for(i=0;i<t.length;i++)l=t[i],a.removeEventListener(l.type,l.attachedListener,yi(l.optionsOrUseCapture));return n.removeChild(a),e}return n.dispatchEvent(e)},In.prototype.focus=function(e){y(this._fragmentFiber.child,!0,cp,e,void 0,void 0)};function cp(e,n){return e.tag===6?!1:(e=Q(e),Cb(e,n))}In.prototype.focusLast=function(e){var n=[];y(this._fragmentFiber.child,!0,Nc,n,void 0,void 0);for(var t=n.length-1;0<=t&&!cp(n[t],e);t--);};function Nc(e,n){return n.push(e),!1}In.prototype.blur=function(){var e=Z(this._fragmentFiber);e!==null&&(e=Q(e),e=bl(e).activeElement,e!==null&&y(this._fragmentFiber.child,!1,hb,e,void 0,void 0))};function hb(e,n){return e.tag===6?!1:(e=Q(e),e===n||e.contains(n)?(n.blur(),!0):!1)}In.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),y(this._fragmentFiber.child,!1,vb,e,void 0,void 0)};function vb(e,n){return e.tag===6||(e=Q(e),n.observe(e)),!1}In.prototype.unobserveUsing=function(e){var n=this._observers;if(n!==null&&n.has(e)){n.delete(e),y(this._fragmentFiber.child,!1,bb,e,void 0,void 0);for(var t=n=0;t<nt.length;t++){var a=nt[t];a.fragmentInstance===this&&a.observer===e?e.unobserve(a.instance):nt[n++]=a}nt.length=n}};function bb(e,n){return e.tag===6||(e=Q(e),n.unobserve(e)),!1}var nt=[],Lc=!1;function yb(e,n,t){nt.push({fragmentInstance:e,observer:n,instance:t}),Lc||(Lc=!0,kb(function(){Lc=!1;var a=nt;nt=[];for(var i=0;i<a.length;i++){var l=a[i];l.observer.unobserve(l.instance)}}))}In.prototype.getClientRects=function(){var e=[];return y(this._fragmentFiber.child,!1,xb,e,void 0,void 0),e};function xb(e,n){if(e.tag===6){e=e.stateNode;var t=e.ownerDocument.createRange();t.selectNodeContents(e),n.push.apply(n,t.getClientRects())}else e=Q(e),n.push.apply(n,e.getClientRects());return!1}In.prototype.getRootNode=function(e){var n=Z(this._fragmentFiber);return n===null?this:Q(n).getRootNode(e)},In.prototype.compareDocumentPosition=function(e){var n=Z(this._fragmentFiber);if(n===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var t=[];y(this._fragmentFiber.child,!1,Nc,t,void 0,void 0);var a=Q(n);if(t.length===0){if(t=a,ce(this._fragmentFiber)){e:{for(n=this._fragmentFiber.return;n!==null;){if(n.tag===4){n=n.stateNode.containerInfo;break e}if(n.tag===3||n.tag===5||n.tag===27)break;n=n.return}n=null}n!=null&&(t=n)}n=this._fragmentFiber;var i=a=t.compareDocumentPosition(e);return t===e?i=Node.DOCUMENT_POSITION_CONTAINS:a&Node.DOCUMENT_POSITION_CONTAINED_BY&&(t=ue(n)[1],t===null?i=Node.DOCUMENT_POSITION_PRECEDING:(e=Q(t).compareDocumentPosition(e),i=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),i|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}n=Q(t[0]),i=Q(t[t.length-1]);var l=ce(this._fragmentFiber)?n.parentElement:a;if(l==null)return Node.DOCUMENT_POSITION_DISCONNECTED;a=l.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_CONTAINED_BY,l=l.compareDocumentPosition(i)&Node.DOCUMENT_POSITION_CONTAINED_BY;var o=n.compareDocumentPosition(e),s=i.compareDocumentPosition(e),u=o&Node.DOCUMENT_POSITION_CONTAINED_BY||s&Node.DOCUMENT_POSITION_CONTAINED_BY;return s=a&&l&&o&Node.DOCUMENT_POSITION_FOLLOWING&&s&Node.DOCUMENT_POSITION_PRECEDING,n=a&&n===e||l&&i===e||u||s?Node.DOCUMENT_POSITION_CONTAINED_BY:!a&&n===e||!l&&i===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:o,n&Node.DOCUMENT_POSITION_DISCONNECTED||n&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||wb(n,this._fragmentFiber,t[0],t[t.length-1],e)?n:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function wb(e,n,t,a,i){var l=ma(i);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(t=!!l)e:{for(;l!==null;){if(l.tag===7&&(l===n||l.alternate===n)){t=!0;break e}l=l.return}t=!1}return t}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(l===null)return l=i.ownerDocument,i===l||i===l.documentElement||i===l.body;e:{for(l=n,n=Z(n);l!==null;){if(!(l.tag!==5&&l.tag!==3&&l.tag!==27||l!==n&&l.alternate!==n)){l=!0;break e}l=l.return}l=!1}return l}return e&Node.DOCUMENT_POSITION_PRECEDING?((n=!!l)&&!(n=l===t)&&(n=Ne(t,l,ye),n===null?n=!1:(y(n,!0,Se,l,t),l=ge,ge=null,n=l!==null)),n):e&Node.DOCUMENT_POSITION_FOLLOWING?((n=!!l)&&!(n=l===a)&&(n=Ne(a,l,ye),n===null?n=!1:(y(n,!0,me,l,a),l=ge,O=ge=null,n=l!==null)),n):!1}function up(e,n){var t=e.ownerDocument.createRange();t.selectNodeContents(e),e=t.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,n?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}In.prototype.scrollIntoView=function(e){if(typeof e=="object")throw Error(c(566));var n=[];y(this._fragmentFiber.child,!1,Nc,n,void 0,void 0);var t=e!==!1;if(n.length===0){var a=ue(this._fragmentFiber);if(a=t?a[1]||a[0]||Z(this._fragmentFiber):a[0]||a[1],a===null)return;if(a.tag===6){e=Q(a),up(e,t);return}if(a=Q(a),a.nodeType!==9){if(a.nodeType===11){t="host"in a?a.host:null,t!==null&&t.scrollIntoView(e);return}a.scrollIntoView(e)}}for(a=t?n.length-1:0;a!==(t?-1:n.length);){var i=n[a];i.tag===6?(i=Q(i),up(i,t)):Q(i).scrollIntoView(e),a+=t?-1:1}};function Sb(e,n){return e=Q(e),dp(e,n),!1}function dp(e,n){e.reactFragments==null&&(e.reactFragments=new Set),e.reactFragments.add(n)}function fp(e,n){var t=n._eventListeners;if(t!==null)for(var a=0;a<t.length;a++){var i=t[a];e.addEventListener(i.type,i.attachedListener,yi(i.optionsOrUseCapture))}e.nodeType!==3&&(t=n._observers,t!==null&&t.forEach(function(l){for(var o=0,s=0;s<nt.length;s++){var u=nt[s];(u.fragmentInstance!==n||u.observer!==l||u.instance!==e)&&(nt[o++]=u)}nt.length=o,l.observe(e)}),dp(e,n))}function Eb(e,n){var t=n._eventListeners;if(t!==null)for(var a=0;a<t.length;a++){var i=t[a];e.removeEventListener(i.type,i.attachedListener,yi(i.optionsOrUseCapture))}e.nodeType!==3&&(t=n._observers,t!==null&&t.forEach(function(l){typeof l.rootMargin=="string"?yb(n,l,e):l.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(n))}function zc(e){var n=e.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var t=n;switch(n=n.nextSibling,t.nodeName){case"HTML":case"HEAD":case"BODY":zc(t),Il(t);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(t.rel.toLowerCase()==="stylesheet")continue}e.removeChild(t)}}function Tb(e,n,t,a){for(;e.nodeType===1;){var i=t;if(e.nodeName.toLowerCase()!==n.toLowerCase()){if(!a&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(a){if(!e[Bi])switch(n){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(l=e.getAttribute("rel"),l==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(l!==i.rel||e.getAttribute("href")!==(i.href==null||i.href===""?null:i.href)||e.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute("title")!==(i.title==null?null:i.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(l=e.getAttribute("src"),(l!==(i.src==null?null:i.src)||e.getAttribute("type")!==(i.type==null?null:i.type)||e.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin))&&l&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(n==="input"&&e.type==="hidden"){var l=i.name==null?null:""+i.name;if(i.type==="hidden"&&e.getAttribute("name")===l)return e}else return e;if(e=Zn(e.nextSibling),e===null)break}return null}function Ab(e,n,t){if(n==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=Zn(e.nextSibling),e===null))return null;return e}function mp(e,n){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Zn(e.nextSibling),e===null))return null;return e}function Rc(e){return e.data==="$?"||e.data==="$~"}function Oc(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function Mb(e,n){var t=e.ownerDocument;if(e.data==="$~")e._reactRetry=n;else if(e.data!=="$?"||t.readyState!=="loading")n();else{var a=function(){n(),t.removeEventListener("DOMContentLoaded",a)};t.addEventListener("DOMContentLoaded",a),e._reactRetry=a}}function Zn(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return e}var jc=null;function pp(e){e=e.nextSibling;for(var n=0;e;){if(e.nodeType===8){var t=e.data;if(t==="/$"||t==="/&"){if(n===0)return Zn(e.nextSibling);n--}else t!=="$"&&t!=="$!"&&t!=="$?"&&t!=="$~"&&t!=="&"||n++}e=e.nextSibling}return null}function gp(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var t=e.data;if(t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"){if(n===0)return e;n--}else t!=="/$"&&t!=="/&"||n++}e=e.previousSibling}return null}function Cb(e,n){function t(){a=!0}if(e.ownerDocument.activeElement===e)return!0;var a=!1;try{e.ownerDocument.addEventListener("focus",t,!0),(e.focus||HTMLElement.prototype.focus).call(e,n)}finally{e.ownerDocument.removeEventListener("focus",t,!0)}return a}function kb(e){np(function(){np(function(n){return e(n)})})}function hp(e,n,t){switch(n=bl(t),e){case"html":if(e=n.documentElement,!e)throw Error(c(452));return e;case"head":if(e=n.head,!e)throw Error(c(453));return e;case"body":if(e=n.body,!e)throw Error(c(454));return e;default:throw Error(c(451))}}function vp(e,n,t){for(var a in t){var i=t[a];t.hasOwnProperty(a)&&i!=null&&Oe(e,n,a,null,ab,i)}t.dangerouslySetInnerHTML!=null&&(e.textContent=""),e.onclick===lt&&(e.onclick=null),Il(e)}function Dc(e){for(var n=e.attributes;n.length;)e.removeAttributeNode(n[0]);Il(e)}var Qn=new Map,bp=new Set;function yl(e){if(typeof e.getRootNode=="function"){var n=e.getRootNode();if(n.nodeType===9||n.nodeType===11)return n}return e.nodeType===9?e:e.ownerDocument}var Lt=P.d;P.d={f:Nb,r:Lb,D:zb,C:Rb,L:Ob,m:jb,X:Bb,S:Db,M:Ib};function Nb(){var e=Lt.f(),n=qo();return e||n}function Lb(e){var n=_a(e);n!==null&&n.tag===5&&n.type==="form"?xf(n):Lt.r(e)}var xi=typeof document>"u"?null:document;function yp(e,n,t){var a=xi;if(a&&typeof n=="string"&&n){var i=Hn(n);i='link[rel="'+e+'"][href="'+i+'"]',typeof t=="string"&&(i+='[crossorigin="'+t+'"]'),bp.has(i)||(bp.add(i),e={rel:e,crossOrigin:t,href:n},a.querySelector(i)===null&&(n=a.createElement("link"),fn(n,"link",e),nn(n),a.head.appendChild(n)))}}function zb(e){Lt.D(e),yp("dns-prefetch",e,null)}function Rb(e,n){Lt.C(e,n),yp("preconnect",e,n)}function Ob(e,n,t){Lt.L(e,n,t);var a=xi;if(a&&e&&n){var i='link[rel="preload"][as="'+Hn(n)+'"]';n==="image"&&t&&t.imageSrcSet?(i+='[imagesrcset="'+Hn(t.imageSrcSet)+'"]',typeof t.imageSizes=="string"&&(i+='[imagesizes="'+Hn(t.imageSizes)+'"]')):i+='[href="'+Hn(e)+'"]';var l=i;switch(n){case"style":l=wi(e);break;case"script":l=Si(e)}if(!(Qn.has(l)||(e=Y({rel:"preload",href:n==="image"&&t&&t.imageSrcSet?void 0:e,as:n},t),Qn.set(l,e),a.querySelector(i)!==null||n==="style"&&a.querySelector(xl(l))||n==="script"&&a.querySelector(wl(l))))){var o=a.createElement("link");fn(o,"link",e),n==="style"&&(o[Bl]=!0,o.onload=o.onerror=function(){zu(o)}),nn(o),a.head.appendChild(o)}}}function jb(e,n){Lt.m(e,n);var t=xi;if(t&&e){var a=n&&typeof n.as=="string"?n.as:"script",i='link[rel="modulepreload"][as="'+Hn(a)+'"][href="'+Hn(e)+'"]',l=i;switch(a){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":l=Si(e)}if(!Qn.has(l)&&(e=Y({rel:"modulepreload",href:e},n),Qn.set(l,e),t.querySelector(i)===null)){switch(a){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(t.querySelector(wl(l)))return}a=t.createElement("link"),fn(a,"link",e),nn(a),t.head.appendChild(a)}}}function Db(e,n,t){Lt.S(e,n,t);var a=xi;if(a&&e){var i=Ha(a).hoistableStyles,l=wi(e);n=n||"default";var o=i.get(l);if(!o){var s={loading:0,preload:null};if(o=a.querySelector(xl(l)))s.loading=5;else{e=Y({rel:"stylesheet",href:e,"data-precedence":n},t),(t=Qn.get(l))&&Bc(e,t);var u=o=a.createElement("link");nn(u),fn(u,"link",e),u._p=new Promise(function(v,T){u.onload=v,u.onerror=T}),u.addEventListener("load",function(){s.loading|=1}),u.addEventListener("error",function(){s.loading|=2}),s.loading|=4,Ko(o,n,a)}o={type:"stylesheet",instance:o,count:1,state:s},i.set(l,o)}}}function Bb(e,n){Lt.X(e,n);var t=xi;if(t&&e){var a=Ha(t).hoistableScripts,i=Si(e),l=a.get(i);l||(l=t.querySelector(wl(i)),l||(e=Y({src:e,async:!0},n),(n=Qn.get(i))&&Ic(e,n),l=t.createElement("script"),nn(l),fn(l,"link",e),t.head.appendChild(l)),l={type:"script",instance:l,count:1,state:null},a.set(i,l))}}function Ib(e,n){Lt.M(e,n);var t=xi;if(t&&e){var a=Ha(t).hoistableScripts,i=Si(e),l=a.get(i);l||(l=t.querySelector(wl(i)),l||(e=Y({src:e,async:!0,type:"module"},n),(n=Qn.get(i))&&Ic(e,n),l=t.createElement("script"),nn(l),fn(l,"link",e),t.head.appendChild(l)),l={type:"script",instance:l,count:1,state:null},a.set(i,l))}}function xp(e,n,t,a){var i=(i=tt.current)?yl(i):null;if(!i)throw Error(c(446));switch(e){case"meta":case"title":return null;case"style":return typeof t.precedence=="string"&&typeof t.href=="string"?(t=wi(t.href),n=Ha(i).hoistableStyles,a=n.get(t),a||(a={type:"style",instance:null,count:0,state:null},n.set(t,a)),a):{type:"void",instance:null,count:0,state:null};case"link":if(t.rel==="stylesheet"&&typeof t.href=="string"&&typeof t.precedence=="string"){e=wi(t.href);var l=Ha(i).hoistableStyles,o=l.get(e);if(o||(i=i.ownerDocument||i,o={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},l.set(e,o),(l=i.querySelector(xl(e)))?l._p||(o.instance=l,o.state.loading=5):(l=Qn.get(e),l||(l={rel:"preload",as:"style",href:t.href,crossOrigin:t.crossOrigin,integrity:t.integrity,media:t.media,hrefLang:t.hrefLang,referrerPolicy:t.referrerPolicy},Qn.set(e,l)),_b(i,e,l,o.state))),n&&a===null)throw Error(c(528,""));return o}if(n&&a!==null)throw Error(c(529,""));return null;case"script":return n=t.async,t=t.src,typeof t=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(t=Si(t),n=Ha(i).hoistableScripts,a=n.get(t),a||(a={type:"script",instance:null,count:0,state:null},n.set(t,a)),a):{type:"void",instance:null,count:0,state:null};default:throw Error(c(444,e))}}function wi(e){return'href="'+Hn(e)+'"'}function xl(e){return'link[rel="stylesheet"]['+e+"]"}function wp(e){return Y({},e,{"data-precedence":e.precedence,precedence:null})}function _b(e,n,t,a){if(n=e.querySelector('link[rel="preload"][as="style"]['+n+"]")){if(n[Bl]!==!0){a.loading=1;return}}else n=e.createElement("link"),n[Bl]=!0,n.onload=n.onerror=zu.bind(null,n),fn(n,"link",t),nn(n),e.head.appendChild(n);a.preload=n,n.addEventListener("load",function(){return a.loading|=1}),n.addEventListener("error",function(){return a.loading|=2})}function Si(e){return'[src="'+Hn(e)+'"]'}function wl(e){return"script[async]"+e}function Sp(e,n,t){if(n.count++,n.instance===null)switch(n.type){case"style":var a=e.querySelector('style[data-href~="'+Hn(t.href)+'"]');if(a)return n.instance=a,nn(a),a;var i=Y({},t,{"data-href":t.href,"data-precedence":t.precedence,href:null,precedence:null});return a=(e.ownerDocument||e).createElement("style"),nn(a),fn(a,"style",i),Ko(a,t.precedence,e),n.instance=a;case"stylesheet":i=wi(t.href);var l=e.querySelector(xl(i));if(l)return n.state.loading|=4,n.instance=l,nn(l),l;a=wp(t),(i=Qn.get(i))&&Bc(a,i),l=(e.ownerDocument||e).createElement("link"),nn(l);var o=l;return o._p=new Promise(function(s,u){o.onload=s,o.onerror=u}),fn(l,"link",a),n.state.loading|=4,Ko(l,t.precedence,e),n.instance=l;case"script":return l=Si(t.src),(i=e.querySelector(wl(l)))?(n.instance=i,nn(i),i):(a=t,(i=Qn.get(l))&&(a=Y({},t),Ic(a,i)),e=e.ownerDocument||e,i=e.createElement("script"),nn(i),fn(i,"link",a),e.head.appendChild(i),n.instance=i);case"void":return null;default:throw Error(c(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(a=n.instance,n.state.loading|=4,Ko(a,t.precedence,e));return n.instance}function Ko(e,n,t){for(var a=t.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),i=a.length?a[a.length-1]:null,l=i,o=0;o<a.length;o++){var s=a[o];if(s.dataset.precedence===n)l=s;else if(l!==i)break}l?l.parentNode.insertBefore(e,l.nextSibling):(n=t.nodeType===9?t.head:t,n.insertBefore(e,n.firstChild))}function Bc(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.title==null&&(e.title=n.title)}function Ic(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.integrity==null&&(e.integrity=n.integrity)}var Jo=null;function Ep(e,n,t){if(Jo===null){var a=new Map,i=Jo=new Map;i.set(t,a)}else i=Jo,a=i.get(t),a||(a=new Map,i.set(t,a));if(a.has(e))return a;for(a.set(e,null),t=t.getElementsByTagName(e),i=0;i<t.length;i++){var l=t[i];if(!(l[Bi]||l[rn]||e==="link"&&l.getAttribute("rel")==="stylesheet")&&l.namespaceURI!=="http://www.w3.org/2000/svg"){var o=l.getAttribute(n)||"";o=e+o;var s=a.get(o);s?s.push(l):a.set(o,[l])}}return a}function _c(e,n,t){e=e.ownerDocument||e,e.head.insertBefore(t,n==="title"?e.querySelector("head > title"):null)}function Hb(e,n,t){if(t===1||n.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;return n.rel==="stylesheet"?(e=n.disabled,typeof n.precedence=="string"&&e==null):!0;case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function Tp(e,n){return e==="img"&&n.src!=null&&n.src!==""&&n.onLoad==null&&n.loading!=="lazy"}function Ap(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function Mp(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function Cp(e,n){typeof n.decode=="function"&&(e.imgCount++,n.complete||(e.imgBytes+=Mp(n),e.suspenseyImages.push(n)),e=Gb.bind(e),n.decode().then(e,e))}function Ub(e,n,t,a){if(t.type==="stylesheet"&&(typeof a.media!="string"||matchMedia(a.media).matches!==!1)&&(t.state.loading&4)===0){if(t.instance===null){var i=wi(a.href),l=n.querySelector(xl(i));if(l){n=l._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(e.count++,e=Sl.bind(e),n.then(e,e)),t.state.loading|=4,t.instance=l,nn(l);return}l=n.ownerDocument||n,a=wp(a),(i=Qn.get(i))&&Bc(a,i),l=l.createElement("link"),nn(l);var o=l;o._p=new Promise(function(s,u){o.onload=s,o.onerror=u}),fn(l,"link",a),t.instance=l}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(t,n),(n=t.state.preload)&&(t.state.loading&3)===0&&(e.count++,t=Sl.bind(e),n.addEventListener("load",t),n.addEventListener("error",t))}}var $o=0;function qb(e,n){return e.stylesheets&&e.count===0&&Fo(e,e.stylesheets),0<e.count||0<e.imgCount?function(t){var a=setTimeout(function(){if(e.stylesheets&&Fo(e,e.stylesheets),e.unsuspend){var l=e.unsuspend;e.unsuspend=null,l()}},6e4+n);0<e.imgBytes&&$o===0&&($o=62500*lb());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Fo(e,e.stylesheets),e.unsuspend)){var l=e.unsuspend;e.unsuspend=null,l()}},(e.imgBytes>$o?50:800)+n);return e.unsuspend=t,function(){e.unsuspend=null,clearTimeout(a),clearTimeout(i)}}:null}function kp(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)Fo(e,e.stylesheets);else if(e.unsuspend){var n=e.unsuspend;e.unsuspend=null,n()}}}function Sl(){this.count--,kp(this)}function Gb(){this.imgCount--,kp(this)}var Wo=null;function Fo(e,n){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Wo=new Map,n.forEach(Vb,e),Wo=null,Sl.call(e))}function Vb(e,n){if(!(n.state.loading&4)){var t=Wo.get(e);if(t)var a=t.get(null);else{t=new Map,Wo.set(e,t);for(var i=e.querySelectorAll("link[data-precedence],style[data-precedence]"),l=0;l<i.length;l++){var o=i[l];(o.nodeName==="LINK"||o.getAttribute("media")!=="not all")&&(t.set(o.dataset.precedence,o),a=o)}a&&t.set(null,a)}i=n.instance,o=i.getAttribute("data-precedence"),l=t.get(o)||a,l===a&&t.set(null,i),t.set(o,i),this.count++,a=Sl.bind(this),i.addEventListener("load",a),i.addEventListener("error",a),l?l.parentNode.insertBefore(i,l.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),n.state.loading|=4}}var Ei={$$typeof:de,Provider:null,Consumer:null,_currentValue:Kn,_currentValue2:Kn,_threadCount:0};function Yb(e,n,t,a,i,l,o,s,u){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=br(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=br(0),this.hiddenUpdates=br(null),this.identifierPrefix=a,this.onUncaughtError=i,this.onCaughtError=l,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=u,this.transitionTypes=null,this.incompleteTransitions=new Map}function Np(e,n,t,a,i,l,o,s,u,v,T,k){return e=new Yb(e,n,t,o,u,v,T,k,s),n=1,l===!0&&(n|=24),l=yn(3,null,null,n),e.current=l,l.stateNode=e,n=Pr(),n.refCount++,e.pooledCache=n,n.refCount++,l.memoizedState={element:a,isDehydrated:t,cache:n},as(l),e}function Lp(e){return e?(e=Ja,e):Ja}function zp(e,n,t,a,i,l){i=Lp(i),a.context===null?a.context=i:a.pendingContext=i,a=Vt(n),a.payload={element:t},l=l===void 0?null:l,l!==null&&(a.callback=l),t=Yt(e,a,n),t!==null&&(En(t,e,n),Pi(t,e,n))}function Rp(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var t=e.retryLane;e.retryLane=t!==0&&t<n?t:n}}function Hc(e,n){Rp(e,n),(e=e.alternate)&&Rp(e,n)}function Op(e){if(e.tag===13||e.tag===31){var n=va(e,67108864);n!==null&&En(n,e,67108864),Hc(e,67108864)}}function jp(e){if(e.tag===13||e.tag===31){var n=Bn();n=yr(n);var t=va(e,n);t!==null&&En(t,e,n),Hc(e,n)}}var Ti=!0;function Xb(e,n,t,a){var i=D.T;D.T=null;var l=P.p;try{P.p=2,Uc(e,n,t,a)}finally{P.p=l,D.T=i}}function Zb(e,n,t,a){var i=D.T;D.T=null;var l=P.p;try{P.p=8,Uc(e,n,t,a)}finally{P.p=l,D.T=i}}function Uc(e,n,t,a){if(Ti){var i=qc(a);if(i===null)wc(e,n,a,Po,t),Bp(e,a);else if(Kb(i,e,n,t,a))a.stopPropagation();else if(Bp(e,a),n&4&&-1<Qb.indexOf(e)){for(;i!==null;){var l=_a(i);if(l!==null)switch(l.tag){case 3:if(l=l.stateNode,l.current.memoizedState.isDehydrated){var o=fa(l.pendingLanes);if(o!==0){var s=l;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var u=1<<31-Nn(o);s.entanglements[1]|=u,o&=~u}gt(l),(Ce&6)===0&&(_o=Cn()+500,gl(0))}}break;case 31:case 13:s=va(l,2),s!==null&&En(s,l,2),qo(),Hc(l,2)}if(l=qc(a),l===null&&wc(e,n,a,Po,t),l===i)break;i=l}i!==null&&a.stopPropagation()}else wc(e,n,a,null,t)}}function qc(e){return e=Mr(e),Gc(e)}var Po=null;function Gc(e){if(Po=null,e=ma(e),e!==null){var n=M(e);if(n===null)e=null;else{var t=n.tag;if(t===13){if(e=_(n),e!==null)return e;e=null}else if(t===31){if(e=A(n),e!==null)return e;e=null}else if(t===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null)}}return Po=e,null}function Dp(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(lh()){case yu:return 2;case xu:return 8;case zl:case oh:return 32;case wu:return 268435456;default:return 32}default:return 32}}var Vc=!1,ta=null,aa=null,ia=null,El=new Map,Tl=new Map,la=[],Qb="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Bp(e,n){switch(e){case"focusin":case"focusout":ta=null;break;case"dragenter":case"dragleave":aa=null;break;case"mouseover":case"mouseout":ia=null;break;case"pointerover":case"pointerout":El.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Tl.delete(n.pointerId)}}function Al(e,n,t,a,i,l){return e===null||e.nativeEvent!==l?(e={blockedOn:n,domEventName:t,eventSystemFlags:a,nativeEvent:l,targetContainers:[i]},n!==null&&(n=_a(n),n!==null&&Op(n)),e):(e.eventSystemFlags|=a,n=e.targetContainers,i!==null&&n.indexOf(i)===-1&&n.push(i),e)}function Kb(e,n,t,a,i){switch(n){case"focusin":return ta=Al(ta,e,n,t,a,i),!0;case"dragenter":return aa=Al(aa,e,n,t,a,i),!0;case"mouseover":return ia=Al(ia,e,n,t,a,i),!0;case"pointerover":var l=i.pointerId;return El.set(l,Al(El.get(l)||null,e,n,t,a,i)),!0;case"gotpointercapture":return l=i.pointerId,Tl.set(l,Al(Tl.get(l)||null,e,n,t,a,i)),!0}return!1}function Ip(e){var n=ma(e.target);if(n!==null){var t=M(n);if(t!==null){if(n=t.tag,n===13){if(n=_(t),n!==null){e.blockedOn=n,ku(e.priority,function(){jp(t)});return}}else if(n===31){if(n=A(t),n!==null){e.blockedOn=n,ku(e.priority,function(){jp(t)});return}}else if(n===3&&t.stateNode.current.memoizedState.isDehydrated){e.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}e.blockedOn=null}function er(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var t=qc(e.nativeEvent);if(t===null){t=e.nativeEvent;var a=new t.constructor(t.type,t);Ar=a,t.target.dispatchEvent(a),Ar=null}else return n=_a(t),n!==null&&Op(n),e.blockedOn=t,!1;n.shift()}return!0}function _p(e,n,t){er(e)&&t.delete(n)}function Jb(){Vc=!1,ta!==null&&er(ta)&&(ta=null),aa!==null&&er(aa)&&(aa=null),ia!==null&&er(ia)&&(ia=null),El.forEach(_p),Tl.forEach(_p)}function nr(e,n){e.blockedOn===n&&(e.blockedOn=null,Vc||(Vc=!0,d.unstable_scheduleCallback(d.unstable_NormalPriority,Jb)))}var tr=null;function Hp(e){tr!==e&&(tr=e,d.unstable_scheduleCallback(d.unstable_NormalPriority,function(){tr===e&&(tr=null);for(var n=0;n<e.length;n+=3){var t=e[n],a=e[n+1],i=e[n+2];if(typeof a!="function"){if(Gc(a||t)===null)continue;break}var l=_a(t);l!==null&&(e.splice(n,3),n-=3,Ts(l,{pending:!0,data:i,method:t.method,action:a},a,i))}}))}function Ai(e){function n(u){return nr(u,e)}ta!==null&&nr(ta,e),aa!==null&&nr(aa,e),ia!==null&&nr(ia,e),El.forEach(n),Tl.forEach(n);for(var t=0;t<la.length;t++){var a=la[t];a.blockedOn===e&&(a.blockedOn=null)}for(;0<la.length&&(t=la[0],t.blockedOn===null);)Ip(t),t.blockedOn===null&&la.shift();if(t=(e.ownerDocument||e).$$reactFormReplay,t!=null)for(a=0;a<t.length;a+=3){var i=t[a],l=t[a+1],o=i[bn]||null;if(typeof l=="function")o||Hp(t);else if(o){var s=null;if(l&&l.hasAttribute("formAction")){if(i=l,o=l[bn]||null)s=o.formAction;else if(Gc(i)!==null)continue}else s=o.action;typeof s=="function"?t[a+1]=s:(t.splice(a,3),a-=3),Hp(t)}}}function Up(){function e(l){l.canIntercept&&l.info==="react-transition"&&l.intercept({handler:function(){return new Promise(function(o){return i=o})},focusReset:"manual",scroll:"manual"})}function n(){i!==null&&(i(),i=null),a||setTimeout(t,20)}function t(){if(!a&&!navigation.transition){var l=navigation.currentEntry;l&&l.url!=null&&navigation.navigate(l.url,{state:l.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var a=!1,i=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(t,100),function(){a=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),i!==null&&(i(),i=null)}}}function Yc(e){this._internalRoot=e}ar.prototype.render=Yc.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(c(409));var t=n.current,a=Bn();zp(t,a,e,n,null,null)},ar.prototype.unmount=Yc.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;zp(e.current,2,null,e,null,null),qo(),n[Ia]=null}};function ar(e){this._internalRoot=e}ar.prototype.unstable_scheduleHydration=function(e){if(e){var n=Cu();e={blockedOn:null,target:e,priority:n};for(var t=0;t<la.length&&n!==0&&n<la[t].priority;t++);la.splice(t,0,e),t===0&&Ip(e)}};var qp=g.version;if(qp!=="19.3.1")throw Error(c(527,qp,"19.3.1"));P.findDOMNode=function(e){var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(c(188)):(e=Object.keys(e).join(","),Error(c(268,e)));return e=S(n),e=e!==null?N(e):null,e=e===null?null:e.stateNode,e};var $b={bundleType:0,version:"19.3.1",rendererPackageName:"react-dom",currentDispatcherRef:D,reconcilerVersion:"19.3.1"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ir=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ir.isDisabled&&ir.supportsFiber)try{Oi=ir.inject($b),kn=ir}catch{}}return Ci.createRoot=function(e,n){if(!b(e))throw Error(c(299));var t=!1,a="",i=Lf,l=zf,o=Rf;return n!=null&&(n.unstable_strictMode===!0&&(t=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onUncaughtError!==void 0&&(i=n.onUncaughtError),n.onCaughtError!==void 0&&(l=n.onCaughtError),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),n=Np(e,1,!1,null,null,t,a,null,i,l,o,Up),e[Ia]=n.current,xc(e),new Yc(n)},Ci.hydrateRoot=function(e,n,t){if(!b(e))throw Error(c(299));var a=!1,i="",l=Lf,o=zf,s=Rf,u=null;return t!=null&&(t.unstable_strictMode===!0&&(a=!0),t.identifierPrefix!==void 0&&(i=t.identifierPrefix),t.onUncaughtError!==void 0&&(l=t.onUncaughtError),t.onCaughtError!==void 0&&(o=t.onCaughtError),t.onRecoverableError!==void 0&&(s=t.onRecoverableError),t.formState!==void 0&&(u=t.formState)),n=Np(e,1,!0,n,t??null,a,i,u,l,o,s,Up),n.context=Lp(null),t=n.current,a=Bn(),a=yr(a),i=Vt(a),i.callback=null,Yt(t,i,a),t=a,n.current.lanes=t,Di(n,t),gt(n),e[Ia]=n.current,xc(e),new ar(n)},Ci.version="19.3.1",Ci}var nu;function Wp(){if(nu)return sr.exports;nu=1;function d(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(d)}catch(g){console.error(g)}}return d(),sr.exports=$p(),sr.exports}var Fp=Wp();const Pp=Xc(Fp);const eg=d=>d.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),tu=(...d)=>d.filter((g,E,c)=>!!g&&g.trim()!==""&&c.indexOf(g)===E).join(" ").trim();var ng={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const tg=B.forwardRef(({color:d="currentColor",size:g=24,strokeWidth:E=2,absoluteStrokeWidth:c,className:b="",children:M,iconNode:_,...A},L)=>B.createElement("svg",{ref:L,...ng,width:g,height:g,stroke:d,strokeWidth:c?Number(E)*24/Number(g):E,className:tu("lucide",b),...A},[..._.map(([S,N])=>B.createElement(S,N)),...Array.isArray(M)?M:[M]]));const He=(d,g)=>{const E=B.forwardRef(({className:c,...b},M)=>B.createElement(tg,{ref:M,iconNode:g,className:tu(`lucide-${eg(d)}`,c),...b}));return E.displayName=`${d}`,E};const ag=He("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);const zt=He("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);const ig=He("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);const lg=He("ArrowUp",[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]]);const ra=He("BookOpen",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);const Ml=He("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);const au=He("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);const og=He("CircleHelp",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);const rg=He("Crown",[["path",{d:"M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",key:"1vdc57"}],["path",{d:"M5 21h14",key:"11awu3"}]]);const sg=He("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);const cg=He("Folder",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]);const ug=He("Languages",[["path",{d:"m5 8 6 6",key:"1wu5hv"}],["path",{d:"m4 14 6-6 2-3",key:"1k1g8d"}],["path",{d:"M2 5h12",key:"or177f"}],["path",{d:"M7 2h1",key:"1t2jsx"}],["path",{d:"m22 22-5-10-5 10",key:"don7ne"}],["path",{d:"M14 18h6",key:"1m8k6r"}]]);const dg=He("Layers",[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]]);const fg=He("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);const fr=He("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);const iu=He("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);const mg=He("RotateCw",[["path",{d:"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",key:"1p45f6"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}]]);const pg=He("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);const gg=He("Settings2",[["path",{d:"M20 7h-9",key:"3s1dr2"}],["path",{d:"M14 17H5",key:"gfn3mx"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["circle",{cx:"7",cy:"7",r:"3",key:"dfmy0x"}]]);const hg=He("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);const vg=He("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);const bg=He("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);const lu=He("Volume2",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]]);const ou=He("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),Rt=["en","ru","de","fr","it","es"],sa={en:"English",ru:"Русский",de:"Deutsch",fr:"Français",it:"Italiano",es:"Español"},yg={learn:["Learn","Учить","Lernen","Apprendre","Impara","Aprender"],categories:["Vocabulary","Словарь","Wortschatz","Vocabulaire","Vocabolario","Vocabulario"],add:["Add word","Добавить слово","Wort hinzufügen","Ajouter un mot","Aggiungi parola","Añadir palabra"],settings:["Settings","Настройки","Einstellungen","Réglages","Impostazioni","Ajustes"],tagline:["Make words your own.","Пусть слова станут вашими.","Mach Wörter zu deinen.","Les mots vous appartiennent.","Fai tue le parole.","Haz tuyas las palabras."],workspace:["YOUR WORKSPACE","ВАШЕ ПРОСТРАНСТВО","DEIN LERNRAUM","VOTRE ESPACE","IL TUO SPAZIO","TU ESPACIO"],local:["Your progress stays on this device","Прогресс хранится на этом устройстве","Dein Fortschritt bleibt auf diesem Gerät","Votre progression reste sur cet appareil","I tuoi progressi restano su questo dispositivo","Tu progreso se guarda en este dispositivo"],study:["A little practice. Lasting knowledge.","Немного практики. Прочные знания.","Ein wenig Übung. Bleibendes Wissen.","Un peu de pratique. Un savoir durable.","Un po’ di pratica. Un sapere duraturo.","Un poco de práctica. Conocimiento duradero."],studySub:["Take your time. Every word is a step forward.","Не спешите. Каждое слово — шаг вперёд.","Nimm dir Zeit. Jedes Wort bringt dich weiter.","Prenez votre temps. Chaque mot est un pas en avant.","Prenditi il tuo tempo. Ogni parola è un passo avanti.","Tómate tu tiempo. Cada palabra es un paso adelante."],mixed:["Mixed continuous","Непрерывный смешанный","Fortlaufend gemischt","Continu mixte","Continuo misto","Continuo mixto"],new:["New words","Новые слова","Neue Wörter","Nouveaux mots","Parole nuove","Palabras nuevas"],review:["In progress","В работе","In Arbeit","En cours","In corso","En progreso"],mastered:["Mastered","Освоено","Gelernt","Maîtrisés","Imparate","Dominadas"],total:["Total words","Всего слов","Wörter gesamt","Total des mots","Parole totali","Total de palabras"],learning:["Learning","Изучается","In Arbeit","En cours","In corso","En aprendizaje"],session:["STUDY SESSION","УЧЕБНАЯ СЕССИЯ","LERNSITZUNG","SESSION","SESSIONE","SESIÓN"],undo:["Undo","Отменить","Rückgängig","Annuler","Annulla","Deshacer"],remaining:["remaining","осталось","übrig","restants","rimanenti","restantes"],reveal:["Reveal","Показать","Aufdecken","Révéler","Mostra","Revelar"],tap:["Tap the card to reveal","Нажмите, чтобы увидеть перевод","Tippen, um die Übersetzung zu sehen","Touchez pour voir la traduction","Tocca per vedere la traduzione","Toca para ver la traducción"],repeat:["Repeat","Повторить","Wiederholen","Répéter","Ripeti","Repetir"],know:["I know","Знаю","Gewusst","Je sais","Lo so","Lo sé"],master:["Already mastered","Уже освоено","Bereits gelernt","Déjà maîtrisé","Già imparata","Ya dominada"],listen:["Listen to pronunciation","Послушать произношение","Aussprache anhören","Écouter la prononciation","Ascolta la pronuncia","Escuchar pronunciación"],translation:["Translation","Перевод","Übersetzung","Traduction","Traduzione","Traducción"],example:["IN CONTEXT","В КОНТЕКСТЕ","IM KONTEXT","EN CONTEXTE","NEL CONTESTO","EN CONTEXTO"],tip:["Space to reveal. Arrow keys to move forward.","Пробел — перевод. Стрелки — оценка.","Leertaste zum Aufdecken. Pfeiltasten zum Bewerten.","Espace pour révéler. Flèches pour avancer.","Spazio per rivelare. Frecce per proseguire.","Espacio para revelar. Flechas para avanzar."],ready:["Ready when you are.","Начните, когда будете готовы.","Bereit, wenn du es bist.","À votre rythme.","Quando vuoi tu.","Cuando tú quieras."],empty:["No words in this selection. Add words or select another folder.","В этой выборке нет слов. Добавьте слова или выберите другую папку.","Diese Auswahl enthält keine Wörter. Füge Wörter hinzu oder wähle einen anderen Ordner.","Aucun mot dans cette sélection. Ajoutez des mots ou choisissez un autre dossier.","Nessuna parola nella selezione. Aggiungi parole o scegli un’altra cartella.","No hay palabras en esta selección. Añade palabras o elige otra carpeta."],complete:["All words mastered.","Все слова освоены.","Alle Wörter gelernt.","Tous les mots sont maîtrisés.","Tutte le parole sono imparate.","Todas las palabras dominadas."],completeSub:["Reset a word or folder whenever you want to practice again.","Сбросьте прогресс слова или папки, чтобы практиковать снова.","Setze ein Wort oder einen Ordner zurück, um erneut zu üben.","Réinitialisez un mot ou un dossier pour pratiquer à nouveau.","Azzera una parola o cartella per esercitarti di nuovo.","Reinicia una palabra o carpeta para practicar de nuevo."],start:["Start practice","Начать","Übung starten","Commencer","Inizia","Comenzar"],restart:["Build a new session","Новая сессия","Neue Sitzung","Nouvelle session","Nuova sessione","Nueva sesión"],end:["End session","Закончить","Sitzung beenden","Terminer","Termina","Terminar"],libraryTitle:["Your growing vocabulary.","Ваш растущий словарь.","Dein wachsender Wortschatz.","Votre vocabulaire s’enrichit.","Il tuo vocabolario cresce.","Tu vocabulario crece."],librarySub:["Organize your words. Choose what to learn next.","Упорядочьте слова. Выберите, что учить дальше.","Ordne deine Wörter. Wähle, was du als Nächstes lernst.","Organisez vos mots. Choisissez la suite.","Organizza le parole. Scegli cosa imparare.","Organiza tus palabras. Elige qué aprender."],folder:["Folder","Папка","Ordner","Dossier","Cartella","Carpeta"],newFolder:["New folder","Новая папка","Neuer Ordner","Nouveau dossier","Nuova cartella","Nueva carpeta"],folderName:["Folder name","Название папки","Ordnername","Nom du dossier","Nome della cartella","Nombre de carpeta"],active:["Include in practice","Включить в обучение","In Übungen verwenden","Inclure dans la pratique","Includi nella pratica","Incluir en práctica"],search:["Search words or translations…","Поиск слов или переводов…","Wörter oder Übersetzungen suchen…","Chercher un mot ou une traduction…","Cerca parole o traduzioni…","Buscar palabras o traducciones…"],all:["All folders","Все папки","Alle Ordner","Tous les dossiers","Tutte le cartelle","Todas las carpetas"],word:["Word","Слово","Wort","Mot","Parola","Palabra"],status:["Status","Статус","Status","Statut","Stato","Estado"],noResults:["No matching words.","Совпадений нет.","Keine passenden Wörter.","Aucun mot trouvé.","Nessuna parola trovata.","No hay resultados."],edit:["Edit word","Изменить слово","Wort bearbeiten","Modifier le mot","Modifica parola","Editar palabra"],reset:["Reset progress","Сбросить прогресс","Fortschritt zurücksetzen","Réinitialiser","Azzera progressi","Reiniciar progreso"],addTitle:["A new word. A new possibility.","Новое слово. Новые возможности.","Ein neues Wort. Neue Möglichkeiten.","Un nouveau mot. Une possibilité.","Una parola. Una nuova possibilità.","Una palabra. Una nueva posibilidad."],addSub:["Add something worth remembering.","Добавьте то, что стоит запомнить.","Füge etwas hinzu, das du dir merken möchtest.","Ajoutez quelque chose à retenir.","Aggiungi qualcosa da ricordare.","Añade algo que merezca recordarse."],targetWord:["Word in the learning language","Слово на изучаемом языке","Wort in der Lernsprache","Mot dans la langue étudiée","Parola nella lingua studiata","Palabra en el idioma de estudio"],transcription:["Transcription (optional)","Транскрипция (необязательно)","Lautschrift (optional)","Transcription (facultatif)","Trascrizione (facoltativa)","Transcripción (opcional)"],translate:["Translate","Перевести","Übersetzen","Traduire","Traduci","Traducir"],translating:["Translating…","Перевод…","Wird übersetzt…","Traduction…","Traduzione…","Traduciendo…"],translateError:["Translation is unavailable. You can enter it yourself.","Перевод недоступен. Введите его вручную.","Übersetzung nicht verfügbar. Bitte manuell eingeben.","Traduction indisponible. Vous pouvez la saisir.","Traduzione non disponibile. Puoi inserirla manualmente.","Traducción no disponible. Puedes escribirla."],offline:["Translation from the offline starter dictionary.","Перевод из встроенного словаря.","Übersetzung aus dem Offline-Wörterbuch.","Traduction du dictionnaire hors ligne.","Traduzione dal dizionario offline.","Traducción del diccionario sin conexión."],context:["Example sentence (optional)","Пример предложения (необязательно)","Beispielsatz (optional)","Phrase d’exemple (facultatif)","Frase d’esempio (facoltativa)","Frase de ejemplo (opcional)"],contextTranslation:["Sentence translation","Перевод предложения","Satzübersetzung","Traduction de la phrase","Traduzione della frase","Traducción de la frase"],save:["Save to vocabulary","Сохранить в словарь","Im Wortschatz speichern","Enregistrer le mot","Salva nel vocabolario","Guardar en vocabulario"],saved:["Word saved to your vocabulary.","Слово сохранено в словарь.","Wort im Wortschatz gespeichert.","Mot enregistré.","Parola salvata.","Palabra guardada."],saveChanges:["Save changes","Сохранить изменения","Änderungen speichern","Enregistrer","Salva modifiche","Guardar cambios"],cancel:["Cancel","Отмена","Abbrechen","Annuler","Annulla","Cancelar"],close:["Close","Закрыть","Schließen","Fermer","Chiudi","Cerrar"],settingsTitle:["Make space for your way.","Учитесь по-своему.","Lerne auf deine Art.","Apprenez à votre façon.","Impara a modo tuo.","Aprende a tu manera."],settingsSub:["A few preferences. A practice that fits.","Несколько настроек для удобного обучения.","Ein paar Einstellungen für deine Lernroutine.","Quelques préférences pour votre pratique.","Poche preferenze per la tua pratica.","Unas preferencias para tu práctica."],language:["Language & learning","Язык и обучение","Sprache & Lernen","Langue et apprentissage","Lingua e apprendimento","Idioma y aprendizaje"],interface:["Interface language","Язык интерфейса","Oberflächensprache","Langue de l’interface","Lingua dell’interfaccia","Idioma de la interfaz"],source:["I speak","Мой язык","Ich spreche","Je parle","Parlo","Hablo"],target:["I’m learning","Я изучаю","Ich lerne","J’apprends","Sto imparando","Estoy aprendiendo"],instant:["Instant master on first try","Освоено с первой попытки","Beim ersten Versuch als gelernt markieren","Maîtrise dès le premier essai","Imparata al primo tentativo","Dominar al primer intento"],instantHint:["Known new words become mastered immediately. Otherwise, progress through five recall steps.","Знакомые новые слова сразу считаются освоенными. Иначе — пять шагов запоминания.","Bekannte neue Wörter gelten sofort als gelernt. Sonst folgen fünf Abrufschritte.","Les nouveaux mots connus sont maîtrisés immédiatement. Sinon, cinq étapes de rappel.","Le nuove parole note sono imparate subito. Altrimenti, cinque passi di richiamo.","Las palabras nuevas conocidas se dominan al instante. Si no, cinco pasos de recuerdo."],appearance:["Appearance","Оформление","Darstellung","Apparence","Aspetto","Apariencia"],light:["Light","Светлая","Hell","Clair","Chiaro","Claro"],dark:["Dark","Тёмная","Dunkel","Sombre","Scuro","Oscuro"],data:["Your data","Ваши данные","Deine Daten","Vos données","I tuoi dati","Tus datos"],export:["Export backup","Экспорт копии","Sicherung exportieren","Exporter une sauvegarde","Esporta backup","Exportar copia"],import:["Restore backup","Восстановить копию","Sicherung wiederherstellen","Restaurer une sauvegarde","Ripristina backup","Restaurar copia"],importConfirm:["Replace device data with this backup?","Заменить данные на устройстве этой копией?","Gerätedaten durch diese Sicherung ersetzen?","Remplacer les données par cette sauvegarde ?","Sostituire i dati con questo backup?","¿Reemplazar los datos con esta copia?"],importError:["This backup could not be read.","Не удалось прочитать копию.","Diese Sicherung konnte nicht gelesen werden.","Sauvegarde illisible.","Impossibile leggere il backup.","No se pudo leer la copia."],storageError:["Device storage is unavailable or unreadable. Changes may not survive a reload. Export a backup to keep your progress.","Хранилище недоступно или повреждено. Изменения могут не сохраниться. Экспортируйте копию.","Gerätespeicher nicht verfügbar oder unlesbar. Änderungen bleiben eventuell nicht erhalten. Exportiere eine Sicherung.","Stockage indisponible ou illisible. Exportez une sauvegarde pour conserver votre progression.","Archivio non disponibile o illeggibile. Esporta un backup per conservare i progressi.","Almacenamiento no disponible o ilegible. Exporta una copia para guardar tu progreso."],audioError:["Speech is not supported in this browser.","Браузер не поддерживает озвучивание.","Sprachausgabe wird nicht unterstützt.","Synthèse vocale non prise en charge.","Sintesi vocale non supportata.","La síntesis de voz no es compatible."],studyMode:["Recall mode","Режим запоминания","Abrufmodus","Mode de rappel","Modalità di richiamo","Modo de recuerdo"],swipeOnly:["Swipe cards","Карточки","Karten wischen","Cartes classiques","Schede classiche","Tarjetas clásicas"],typeOnly:["Type every answer","Вводить каждый ответ","Jede Antwort tippen","Saisir chaque réponse","Scrivi ogni risposta","Escribir cada respuesta"],mixedRecall:["Mixed recall","Смешанное запоминание","Gemischter Abruf","Rappel mixte","Richiamo misto","Recuerdo mixto"],mixedRecallHint:["Learning cards require typing. New and review cards use swiping.","Изучаемые слова требуют ввода. Новые и повторяемые — обычные карточки.","Wörter in Arbeit werden getippt. Neue und fällige Wörter bleiben Wischkarten.","Les mots en cours exigent une saisie. Les autres utilisent les cartes classiques.","Le parole in apprendimento richiedono la scrittura. Le altre usano le schede.","Las palabras en aprendizaje requieren escribir. Las otras usan tarjetas."],strictAccents:["Require exact accents","Учитывать диакритику","Akzente genau prüfen","Exiger les accents exacts","Richiedi accenti esatti","Exigir acentos exactos"],strictAccentsHint:["When disabled, e matches é and u matches ü.","Если отключено, e соответствует é, а u — ü.","Ohne diese Option entspricht e auch é und u auch ü.","Sinon, e correspond à é et u à ü.","Se disattivato, e corrisponde a é e u a ü.","Si se desactiva, e coincide con é y u con ü."],inputMode:["Answer input","Ввод ответа","Antworteingabe","Saisie de réponse","Inserimento risposta","Entrada de respuesta"],keyboard:["Keyboard","Клавиатура","Tastatur","Clavier","Tastiera","Teclado"],tiles:["Letter tiles","Буквы","Buchstaben","Lettres","Tessere","Fichas de letras"],typePrompt:["Write the word you are learning","Напишите слово на изучаемом языке","Schreibe das Wort in der Lernsprache","Écrivez le mot dans la langue étudiée","Scrivi la parola nella lingua studiata","Escribe la palabra en el idioma de estudio"],answer:["Your answer","Ваш ответ","Deine Antwort","Votre réponse","La tua risposta","Tu respuesta"],checkAnswer:["Check","Проверить","Prüfen","Vérifier","Verifica","Comprobar"],hint:["Hint","Подсказка","Hinweis","Indice","Suggerimento","Pista"],giveUp:["Give up / reveal","Показать ответ","Antwort zeigen","Voir la réponse","Mostra risposta","Ver respuesta"],next:["Next","Далее","Weiter","Suivant","Avanti","Siguiente"],correct:["Correct","Верно","Richtig","Correct","Corretto","Correcto"],assisted:["Correct with a hint","Верно с подсказкой","Richtig mit Hinweis","Correct avec un indice","Corretto con suggerimento","Correcto con pista"],incorrect:["Not quite","Не совсем","Noch nicht richtig","Pas tout à fait","Non proprio","No del todo"],correctHint:["Ready to mark as known. Review the card, then continue.","Можно отметить как знакомое. Изучите карточку и продолжайте.","Bereit für „Gewusst“. Prüfe die Karte und fahre fort.","Prêt à marquer comme connu. Relisez la carte, puis continuez.","Pronta da segnare come nota. Rivedi la scheda, poi continua.","Lista para marcar como conocida. Revisa la tarjeta y continúa."],assistedHint:["Repeat after 4 cards. Your current learning step is preserved.","Повтор через 4 карточки. Текущий шаг обучения сохраняется.","Nach 4 Karten wiederholen. Dein Lernschritt bleibt erhalten.","À revoir après 4 cartes. Votre étape reste inchangée.","Ripeti dopo 4 schede. Il passo attuale resta invariato.","Repite tras 4 tarjetas. Se conserva tu paso actual."],incorrectHint:["Review the correction, then repeat. You can override with the arrows.","Изучите исправление и повторите. Оценку можно изменить стрелками.","Prüfe die Korrektur und wiederhole. Mit Pfeilen kannst du anders bewerten.","Relisez la correction, puis répétez. Les flèches permettent de changer la note.","Rivedi la correzione, poi ripeti. Puoi cambiare il voto con le frecce.","Revisa la corrección y repite. Puedes cambiar la nota con las flechas."],tileBank:["Available letters","Доступные буквы","Verfügbare Buchstaben","Lettres disponibles","Lettere disponibili","Letras disponibles"],spaceCharacter:["Space","Пробел","Leerzeichen","Espace","Spazio","Espacio"],removeLetter:["Return letter","Вернуть букву","Buchstabe zurücklegen","Rendre la lettre","Restituisci lettera","Devolver letra"],answerDiff:["Your answer compared with the correct word","Ваш ответ в сравнении с правильным","Deine Antwort im Vergleich zum richtigen Wort","Votre réponse comparée au mot correct","La tua risposta confrontata con la parola corretta","Tu respuesta comparada con la palabra correcta"],typingShortcuts:["Enter: check · Tab: hint · Escape: reveal","Enter: проверить · Tab: подсказка · Escape: ответ","Enter: prüfen · Tab: Hinweis · Escape: Antwort","Entrée : vérifier · Tab : indice · Échap : réponse","Invio: verifica · Tab: suggerimento · Esc: risposta","Intro: comprobar · Tab: pista · Escape: respuesta"],tryAgain:["Not quite. Try again.","Не совсем. Попробуйте ещё раз.","Noch nicht richtig. Versuch es noch einmal.","Pas tout à fait. Réessayez.","Non proprio. Riprova.","No del todo. Inténtalo de nuevo."],attemptsRemaining:["Attempts remaining","Осталось попыток","Verbleibende Versuche","Tentatives restantes","Tentativi rimasti","Intentos restantes"],practice:["Practice","Практиковать","Üben","Pratiquer","Esercitati","Practicar"],practiceSavedWord:["Practice saved word","Учить сохранённое слово","Gespeichertes Wort üben","Pratiquer le mot enregistré","Esercitati con la parola salvata","Practicar la palabra guardada"],practiceSelection:["Practice selection","Выбор для практики","Übungsauswahl","Sélection à pratiquer","Selezione da esercitare","Selección de práctica"],allActiveFolders:["All active folders","Все активные папки","Alle aktiven Ordner","Tous les dossiers actifs","Tutte le cartelle attive","Todas las carpetas activas"],selectedPracticeHint:["Practice the selected words continuously until mastery.","Практикуйте выбранные слова непрерывно до освоения.","Übe die ausgewählten Wörter fortlaufend bis zur Beherrschung.","Pratiquez les mots sélectionnés en continu jusqu’à la maîtrise.","Esercitati con le parole selezionate fino alla padronanza.","Practica las palabras seleccionadas continuamente hasta dominarlas."],selectedWord:["Selected word","Выбранное слово","Ausgewähltes Wort","Mot sélectionné","Parola selezionata","Palabra seleccionada"],modeSwitched:["Continuing with the remaining words in the other mode.","Продолжаем с оставшимися словами в другом режиме.","Weiter mit den übrigen Wörtern im anderen Modus.","La pratique continue avec les mots restants dans l’autre mode.","La pratica continua con le parole rimaste nell’altra modalità.","La práctica continúa con las palabras restantes en el otro modo."],practiced:["cards practiced","карточек пройдено","Karten geübt","cartes pratiquées","schede praticate","tarjetas practicadas"],newMode:["Learn new words","Учить новые слова","Neue Wörter lernen","Apprendre de nouveaux mots","Impara parole nuove","Aprender palabras nuevas"],reviewMode:["Practice / review","Практика / повторение","Üben / wiederholen","Pratique / révision","Pratica / ripasso","Práctica / repaso"],resetNew:["Reset to new","Сбросить к новым","Als neu zurücksetzen","Réinitialiser en nouveau","Azzera come nuova","Reiniciar como nueva"],resetReview:["Reset to review","Сбросить к повторению","Zum Wiederholen zurücksetzen","Réinitialiser en révision","Azzera per ripasso","Reiniciar para repaso"]},xg={en:0,ru:1,de:2,fr:3,it:4,es:5};function wg(d){return g=>yg[g][xg[d]]}const G=(d,g,E,c,b,M)=>({en:d,ru:g,de:E,fr:c,it:b,es:M}),Sg=[{id:"core",name:G("Core vocabulary","Основные слова","Grundwortschatz","Vocabulaire essentiel","Vocabolario di base","Vocabulario esencial"),isActiveForStudy:!0},{id:"verbs",name:G("Essential verbs","Основные глаголы","Wichtige Verben","Verbes essentiels","Verbi essenziali","Verbos esenciales"),isActiveForStudy:!0},{id:"travel",name:G("Travel & everyday life","Путешествия и быт","Reisen & Alltag","Voyage et quotidien","Viaggi e vita quotidiana","Viajes y vida cotidiana"),isActiveForStudy:!0},{id:"abstract",name:G("Ideas & concepts","Идеи и понятия","Ideen & Begriffe","Idées et concepts","Idee e concetti","Ideas y conceptos"),isActiveForStudy:!0}],Eg=[["abstract",G("possibility","возможность","die Möglichkeit","la possibilité","la possibilità","la posibilidad"),G("There is another possibility.","Есть другая возможность.","Es gibt eine andere Möglichkeit.","Il y a une autre possibilité.","C’è un’altra possibilità.","Hay otra posibilidad.")],["core",G("time","время","die Zeit","le temps","il tempo","el tiempo"),G("We have enough time.","У нас достаточно времени.","Wir haben genug Zeit.","Nous avons assez de temps.","Abbiamo abbastanza tempo.","Tenemos suficiente tiempo.")],["core",G("day","день","der Tag","le jour","il giorno","el día"),G("Today is a good day.","Сегодня хороший день.","Heute ist ein guter Tag.","Aujourd’hui est un beau jour.","Oggi è un bel giorno.","Hoy es un buen día.")],["core",G("friend","друг","der Freund","l’ami","l’amico","el amigo"),G("He is my friend.","Он мой друг.","Er ist mein Freund.","C’est mon ami.","È il mio amico.","Él es mi amigo.")],["core",G("water","вода","das Wasser","l’eau","l’acqua","el agua"),G("I would like some water.","Я хотел бы воды.","Ich hätte gern etwas Wasser.","Je voudrais de l’eau.","Vorrei dell’acqua.","Quisiera un poco de agua.")],["core",G("home","дом","das Zuhause","la maison","la casa","la casa"),G("I am going home.","Я иду домой.","Ich gehe nach Hause.","Je rentre à la maison.","Vado a casa.","Voy a casa.")],["core",G("book","книга","das Buch","le livre","il libro","el libro"),G("This book is interesting.","Эта книга интересная.","Dieses Buch ist interessant.","Ce livre est intéressant.","Questo libro è interessante.","Este libro es interesante.")],["core",G("morning","утро","der Morgen","le matin","la mattina","la mañana"),G("I read in the morning.","Я читаю по утрам.","Ich lese am Morgen.","Je lis le matin.","Leggo la mattina.","Leo por la mañana.")],["core",G("work","работа","die Arbeit","le travail","il lavoro","el trabajo"),G("My work is interesting.","Моя работа интересная.","Meine Arbeit ist interessant.","Mon travail est intéressant.","Il mio lavoro è interessante.","Mi trabajo es interesante.")],["verbs",G("to learn","учиться","lernen","apprendre","imparare","aprender"),G("I want to learn a language.","Я хочу учить язык.","Ich möchte eine Sprache lernen.","Je veux apprendre une langue.","Voglio imparare una lingua.","Quiero aprender un idioma.")],["verbs",G("to understand","понимать","verstehen","comprendre","capire","comprender"),G("I understand the question.","Я понимаю вопрос.","Ich verstehe die Frage.","Je comprends la question.","Capisco la domanda.","Comprendo la pregunta.")],["verbs",G("to remember","помнить","sich erinnern","se souvenir","ricordare","recordar"),G("I remember this place.","Я помню это место.","Ich erinnere mich an diesen Ort.","Je me souviens de cet endroit.","Ricordo questo posto.","Recuerdo este lugar.")],["verbs",G("to speak","говорить","sprechen","parler","parlare","hablar"),G("Do you speak English?","Вы говорите по-английски?","Sprechen Sie Englisch?","Parlez-vous anglais ?","Parla inglese?","¿Habla inglés?")],["verbs",G("to read","читать","lesen","lire","leggere","leer"),G("I like to read.","Мне нравится читать.","Ich lese gern.","J’aime lire.","Mi piace leggere.","Me gusta leer.")],["verbs",G("to find","находить","finden","trouver","trovare","encontrar"),G("I cannot find the key.","Я не могу найти ключ.","Ich kann den Schlüssel nicht finden.","Je ne trouve pas la clé.","Non riesco a trovare la chiave.","No puedo encontrar la llave.")],["verbs",G("to choose","выбирать","wählen","choisir","scegliere","elegir"),G("You can choose.","Вы можете выбрать.","Sie können wählen.","Vous pouvez choisir.","Può scegliere.","Puede elegir.")],["verbs",G("to travel","путешествовать","reisen","voyager","viaggiare","viajar"),G("I like to travel by train.","Мне нравится путешествовать на поезде.","Ich reise gern mit dem Zug.","J’aime voyager en train.","Mi piace viaggiare in treno.","Me gusta viajar en tren.")],["travel",G("station","вокзал","der Bahnhof","la gare","la stazione","la estación"),G("Where is the station?","Где вокзал?","Wo ist der Bahnhof?","Où est la gare ?","Dov’è la stazione?","¿Dónde está la estación?")],["travel",G("ticket","билет","die Fahrkarte","le billet","il biglietto","el billete"),G("One ticket, please.","Один билет, пожалуйста.","Eine Fahrkarte, bitte.","Un billet, s’il vous plaît.","Un biglietto, per favore.","Un billete, por favor.")],["travel",G("journey","путешествие","die Reise","le voyage","il viaggio","el viaje"),G("The journey was long.","Путешествие было долгим.","Die Reise war lang.","Le voyage était long.","Il viaggio è stato lungo.","El viaje fue largo.")],["travel",G("street","улица","die Straße","la rue","la strada","la calle"),G("The street is quiet.","Улица тихая.","Die Straße ist ruhig.","La rue est calme.","La strada è tranquilla.","La calle es tranquila.")],["travel",G("room","комната","das Zimmer","la chambre","la camera","la habitación"),G("I have booked a room.","Я забронировал комнату.","Ich habe ein Zimmer gebucht.","J’ai réservé une chambre.","Ho prenotato una camera.","He reservado una habitación.")],["travel",G("breakfast","завтрак","das Frühstück","le petit-déjeuner","la colazione","el desayuno"),G("Breakfast is ready.","Завтрак готов.","Das Frühstück ist fertig.","Le petit-déjeuner est prêt.","La colazione è pronta.","El desayuno está listo.")],["travel",G("airport","аэропорт","der Flughafen","l’aéroport","l’aeroporto","el aeropuerto"),G("We are going to the airport.","Мы едем в аэропорт.","Wir fahren zum Flughafen.","Nous allons à l’aéroport.","Andiamo all’aeroporto.","Vamos al aeropuerto.")],["travel",G("key","ключ","der Schlüssel","la clé","la chiave","la llave"),G("Here is your key.","Вот ваш ключ.","Hier ist Ihr Schlüssel.","Voici votre clé.","Ecco la sua chiave.","Aquí está su llave.")],["abstract",G("knowledge","знание","das Wissen","la connaissance","la conoscenza","el conocimiento"),G("Knowledge opens doors.","Знание открывает двери.","Wissen öffnet Türen.","La connaissance ouvre des portes.","La conoscenza apre le porte.","El conocimiento abre puertas.")],["abstract",G("freedom","свобода","die Freiheit","la liberté","la libertà","la libertad"),G("Freedom is important.","Свобода важна.","Freiheit ist wichtig.","La liberté est importante.","La libertà è importante.","La libertad es importante.")],["abstract",G("experience","опыт","die Erfahrung","l’expérience","l’esperienza","la experiencia"),G("It was a valuable experience.","Это был ценный опыт.","Es war eine wertvolle Erfahrung.","C’était une expérience précieuse.","È stata un’esperienza preziosa.","Fue una experiencia valiosa.")],["abstract",G("purpose","цель","der Zweck","le but","lo scopo","el propósito"),G("What is the purpose?","Какова цель?","Was ist der Zweck?","Quel est le but ?","Qual è lo scopo?","¿Cuál es el propósito?")],["abstract",G("change","изменение","die Veränderung","le changement","il cambiamento","el cambio"),G("Change takes time.","Изменение требует времени.","Veränderung braucht Zeit.","Le changement prend du temps.","Il cambiamento richiede tempo.","El cambio lleva tiempo.")],["abstract",G("balance","равновесие","das Gleichgewicht","l’équilibre","l’equilibrio","el equilibrio"),G("We need to find a balance.","Нам нужно найти равновесие.","Wir müssen ein Gleichgewicht finden.","Nous devons trouver un équilibre.","Dobbiamo trovare un equilibrio.","Necesitamos encontrar un equilibrio.")],["abstract",G("confidence","уверенность","das Selbstvertrauen","la confiance","la fiducia","la confianza"),G("Practice builds confidence.","Практика укрепляет уверенность.","Übung stärkt das Selbstvertrauen.","La pratique renforce la confiance.","La pratica rafforza la fiducia.","La práctica fortalece la confianza.")]],Tg={en:"/ˌpɒsəˈbɪləti/",de:"/ˈmøːklɪçkaɪt/",fr:"/pɔ.si.bi.li.te/",ru:"/vɐzˈmoʐnəsʲtʲ/",it:"/possibiliˈta/",es:"/posibiliˈðað/"};function Cl(d,g){return{categories:structuredClone(Sg),words:Eg.map(([E,c,b],M)=>({id:`${d}-${g}-${M}`,targetWord:c[g],transcription:M===0?Tg[g]:void 0,translations:[c[d]],examples:[{targetSentence:b[g],translatedSentence:b[d]}],categoryIds:[E],status:"NEW",step:0,repCount:0,lastReviewedOrder:0,createdAt:Date.now()}))}}const ru="erudite:v2",su={interfaceLanguage:"en",sourceLanguage:"en",targetLanguage:"de",instantMasterOnFirstTry:!1,studyMode:"SWIPE_ONLY",strictAccents:!0,theme:"light"},cu=(d,g)=>`${d}-${g}`,kl=d=>Number.isSafeInteger(d)&&Number(d)>=0;function uu(d,g){const E=d,c=E?.settings;return E?.version!==g||!c||![c.interfaceLanguage,c.sourceLanguage,c.targetLanguage].every(b=>Rt.includes(b))||c.sourceLanguage===c.targetLanguage||!["light","dark"].includes(c.theme)||typeof c.instantMasterOnFirstTry!="boolean"||c.studyMode!==void 0&&!["SWIPE_ONLY","TYPE_ONLY","MIXED"].includes(c.studyMode)||c.strictAccents!==void 0&&typeof c.strictAccents!="boolean"||!E.pairs||typeof E.pairs!="object"||Array.isArray(E.pairs)||g===2&&(!kl(E.reviewOrder)||!c.studyMode||typeof c.strictAccents!="boolean")?!1:Object.entries(E.pairs).every(([b,M])=>{const[_,A,...L]=b.split("-");return!L.length&&_!==A&&Rt.includes(_)&&Rt.includes(A)&&!!M&&Array.isArray(M.words)&&Array.isArray(M.categories)&&M.categories.every(S=>!!S&&typeof S.id=="string"&&!!S.name&&Rt.every(N=>typeof S.name[N]=="string")&&typeof S.isActiveForStudy=="boolean")&&M.words.every(S=>!!S&&typeof S.id=="string"&&typeof S.targetWord=="string"&&(S.transcription===void 0||typeof S.transcription=="string")&&Array.isArray(S.translations)&&S.translations.every(N=>typeof N=="string")&&Array.isArray(S.categoryIds)&&S.categoryIds.every(N=>typeof N=="string"&&M.categories.some(y=>y.id===N))&&Array.isArray(S.examples)&&S.examples.every(N=>!!N&&typeof N.targetSentence=="string"&&typeof N.translatedSentence=="string")&&["NEW","LEARNING","REVIEW","MASTERED"].includes(S.status)&&Number.isFinite(S.createdAt)&&(S.lastStudiedAt===void 0||Number.isFinite(S.lastStudiedAt))&&kl(S.step)&&S.step<=(g===1?3:5)&&(g===1||(S.status==="NEW"?S.step===0:S.status==="LEARNING"?S.step<=2:S.status==="REVIEW"?S.step>=3&&S.step<5:S.step===5))&&(g===1?[S.interval,S.easeFactor,S.nextReviewDate].every(Number.isFinite):kl(S.repCount)&&kl(S.lastReviewedOrder)&&S.lastReviewedOrder<=E.reviewOrder))&&new Set(M.words.map(S=>S.id)).size===M.words.length&&new Set(M.categories.map(S=>S.id)).size===M.categories.length})}function Ag(d){return uu(d,2)}function du(d){const g=uu(d,1);if(!g&&!Ag(d))throw new Error("Invalid vocabulary backup");const E=d,c=Object.values(E.pairs).flatMap(A=>A.words).filter(A=>A.status!=="NEW").sort((A,L)=>(A.lastStudiedAt??A.createdAt)-(L.lastStudiedAt??L.createdAt)),b=new Map(c.map((A,L)=>[A,L+1])),M={interfaceLanguage:E.settings.interfaceLanguage,sourceLanguage:E.settings.sourceLanguage,targetLanguage:E.settings.targetLanguage,instantMasterOnFirstTry:E.settings.instantMasterOnFirstTry,studyMode:E.settings.studyMode??su.studyMode,strictAccents:E.settings.strictAccents??!0,theme:E.settings.theme},_=Object.fromEntries(Object.entries(E.pairs).map(([A,L])=>[A,{categories:L.categories,words:L.words.map(S=>({id:S.id,targetWord:S.targetWord,transcription:S.transcription,translations:S.translations,examples:S.examples,categoryIds:S.categoryIds,status:S.status,step:g?S.status==="MASTERED"?5:S.status==="REVIEW"?3:S.status==="NEW"?0:Math.min(2,S.step):S.step,repCount:g?0:S.repCount,lastReviewedOrder:g?b.get(S)??0:S.lastReviewedOrder,createdAt:S.createdAt,lastStudiedAt:S.lastStudiedAt}))}]));return{version:2,settings:M,pairs:_,reviewOrder:g?c.length:E.reviewOrder}}function Mg(){const d={version:2,reviewOrder:0,settings:su,pairs:{"en-de":Cl("en","de")}};try{const g=localStorage.getItem(ru)??localStorage.getItem("erudite:v1");return{data:g?du(JSON.parse(g)):d,error:!1}}catch{return{data:d,error:!0}}}function Cg(d){try{return localStorage.setItem(ru,JSON.stringify(d)),!0}catch{return!1}}function kg(d,g,E,c,b={}){const M={...d,lastReviewedOrder:c};return g==="master"?{...M,status:"MASTERED",step:5}:d.status==="MASTERED"?M:(M.repCount+=1,g==="repeat"?{...M,status:"LEARNING",step:b.assisted&&d.status==="LEARNING"?d.step:0}:d.status==="NEW"?E.instantMasterOnFirstTry?{...M,status:"MASTERED",step:5}:{...M,status:"LEARNING",step:1}:(M.step=Math.min(5,d.step+1),M.status=M.step>=5?"MASTERED":M.step>=3?"REVIEW":"LEARNING",M))}function Ng(d,g,E=!1){return g==="repeat"?E?4:3:g==="master"?1/0:d.status==="REVIEW"?50:8*(d.status==="NEW"?1:d.step+1)}function Nl(d,g="NEW"){return{...d,status:g,step:g==="REVIEW"?3:0,repCount:0,lastReviewedOrder:0,lastStudiedAt:void 0}}function ki(d,g){if(g)return d.words.filter(c=>g.kind==="word"?c.id===g.id:c.categoryIds.includes(g.id));const E=new Set(d.categories.filter(c=>c.isActiveForStudy).map(c=>c.id));return d.words.filter(c=>c.categoryIds.some(b=>E.has(b)))}function Lg(d,g,E){const c=ki({words:d,categories:g}),b=c.filter(A=>A.status==="NEW"),M=c.filter(A=>A.status==="LEARNING"||A.status==="REVIEW").sort((A,L)=>A.step-L.step||A.lastReviewedOrder-L.lastReviewedOrder);if(E==="new")return b.map(A=>A.id);if(E==="review")return M.map(A=>A.id);const _=[];for(let A=0,L=0;A<M.length||L<b.length;A+=3,L+=2)_.push(...M.slice(A,A+3),...b.slice(L,L+2));return _.map(A=>A.id)}function ca(d,g,E){return Lg(ki(d,E),d.categories.map(c=>({...c,isActiveForStudy:!0})),g)}function zg(d,g,E){const c=d.slice(1).filter(b=>b!==g.id);return g.status!=="MASTERED"&&c.splice(Math.min(E,c.length),0,g.id),c}function Rg(d,g,E,c,b,M){const _=ca(g,E,M),A=new Set(_),L=zg(d,c,b).filter(y=>A.has(y)),S=new Set(L);if(L.push(..._.filter(y=>!S.has(y))),L.length||!ki(g,M).some(y=>y.status!=="MASTERED"))return{queue:L,mode:E,switched:!1};const N=E==="new"?"review":"new";return{queue:ca(g,N,M),mode:N,switched:!0}}function fu(d,g,E){return ca(d,g,E).length||!ki(d,E).some(c=>c.status!=="MASTERED")?g:g==="new"?"review":"new"}const Og={en:"en-US",ru:"ru-RU",de:"de-DE",fr:"fr-FR",it:"it-IT",es:"es-ES"};function mr(d,g){if(!("speechSynthesis"in window))return!1;window.speechSynthesis.cancel();const E=new SpeechSynthesisUtterance(d);E.lang=Og[g],E.rate=.85;const c=window.speechSynthesis.getVoices().find(b=>b.lang===E.lang)??window.speechSynthesis.getVoices().find(b=>b.lang.startsWith(g));return c&&(E.voice=c),window.speechSynthesis.speak(E),!0}function jg(d,g,E){const c=B.useRef(null),[b,M]=B.useState({x:0,y:0,active:!1}),_=(A,L)=>{if(!c.current||A.pointerId!==c.current.id)return;const S=A.clientX-c.current.x,N=A.clientY-c.current.y;c.current=null,M({x:0,y:0,active:!1}),!(L||E)&&(N<-100&&Math.abs(N)>Math.abs(S)?d("master"):S>100?d("know"):S<-100?d("repeat"):Math.abs(S)<8&&Math.abs(N)<8&&g())};return{drag:b,handlers:{onPointerDown:A=>{E||!A.isPrimary||A.button!==0||A.target.closest("button")||(c.current={x:A.clientX,y:A.clientY,id:A.pointerId},A.currentTarget.setPointerCapture(A.pointerId),M({x:0,y:0,active:!0}))},onPointerMove:A=>{c.current?.id===A.pointerId&&M({x:A.clientX-c.current.x,y:A.clientY-c.current.y,active:!0})},onPointerUp:A=>_(A,!1),onPointerCancel:A=>_(A,!0),onLostPointerCapture:()=>{c.current=null,M({x:0,y:0,active:!1})}}}}function Dg(d,g,E,c){B.useEffect(()=>{const b=M=>{if(!c||M.repeat||M.altKey||M.target instanceof HTMLElement&&M.target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]'))return;if(M.key==="Backspace"||(M.ctrlKey||M.metaKey)&&M.key.toLowerCase()==="z"&&!M.shiftKey){M.preventDefault(),E();return}if(M.ctrlKey||M.metaKey)return;const _={ArrowLeft:"repeat",ArrowRight:"know",ArrowUp:"master"};_[M.key]&&(M.preventDefault(),d(_[M.key])),(M.code==="Space"||M.key==="Enter")&&!(M.target instanceof HTMLElement&&M.target.closest("button"))&&(M.preventDefault(),g())};return window.addEventListener("keydown",b),()=>window.removeEventListener("keydown",b)},[d,g,E,c])}function Ni(d){let g=0;return Array.from(d).filter(E=>E==="("?(g++,!1):E===")"&&g?(g--,!1):g===0).join("").replace(/\s+/g," ").trim()}function Da(d,g){const E=d.trim().toLowerCase();return g?E:E.normalize("NFD").replace(/[\u0300-\u036f]/g,"")}function Bg(d,g,E,c){return Da(d,E)!==Da(Ni(g),E)?"INCORRECT":c?"ASSISTED":"CORRECT"}function Ig(d,g){return g==="TYPE_ONLY"||g==="MIXED"&&d.status==="LEARNING"}function _g(d,g,E){const c=Ni(g),b=d.trimStart(),M=Array.from(E?c:c.normalize("NFC")),_=Array.from(E?b:b.normalize("NFC")),A=S=>E?S.toLowerCase():S.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");let L=0;for(;L<_.length&&L<M.length&&A(_[L])===A(M[L]);)L++;return M.slice(0,Math.min(L+1,M.length)).join("")}function mu(d,g){const E=Ni(g);if(!E)return[{text:d,match:!1}];const c=E.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),b=new RegExp(c,"giu"),M=[];let _=0;for(const A of d.matchAll(b))A.index>_&&M.push({text:d.slice(_,A.index),match:!1}),M.push({text:A[0],match:!0}),_=A.index+A[0].length;return _<d.length&&M.push({text:d.slice(_),match:!1}),M}function pu(d,g){return mu(d,g).map(E=>E.match?"[____]":E.text).join("")}function Hg(d,g,E){const c=Array.from(d.trim()),b=Array.from(Ni(g)),M=(N,y)=>Da(N,E)===Da(y,E),_=Array.from({length:c.length+1},()=>new Uint16Array(b.length+1));for(let N=0;N<=c.length;N++)_[N][0]=N;for(let N=0;N<=b.length;N++)_[0][N]=N;for(let N=1;N<=c.length;N++)for(let y=1;y<=b.length;y++)_[N][y]=Math.min(_[N-1][y]+1,_[N][y-1]+1,_[N-1][y-1]+(M(c[N-1],b[y-1])?0:1));const A=[];let L=c.length,S=b.length;for(;L||S;)if(L&&S&&M(c[L-1],b[S-1])&&_[L][S]===_[L-1][S-1])A.unshift({text:c[--L],kind:"same"}),S--;else if(L&&S&&_[L][S]===_[L-1][S-1]+1){const N=b[--S],y=c[--L];A.unshift({text:y,kind:"wrong"},{text:N,kind:"missing"})}else L&&_[L][S]===_[L-1][S]+1?A.unshift({text:c[--L],kind:"wrong"}):A.unshift({text:b[--S],kind:"missing"});return A}function Ug({sentence:d,target:g}){return r.jsx(r.Fragment,{children:mu(d,g).map((E,c)=>E.match?r.jsx("strong",{children:E.text},c):r.jsx("span",{children:E.text},c))})}function qg({card:d,settings:g,inputMode:E,evaluation:c,onEvaluate:b,onListen:M,audioError:_,t:A}){const[L,S]=B.useState(""),[N,y]=B.useState(!1),[Z,ce]=B.useState(0),ue=B.useRef(0),X=B.useId(),[Q]=B.useState(()=>{const H=Array.from(Ni(d.targetWord)).map((ie,je)=>({char:ie,id:je}));for(let ie=H.length-1;ie>0;ie--){const je=Math.floor(Math.random()*(ie+1));[H[ie],H[je]]=[H[je],H[ie]]}return H}),[ge,O]=B.useState([]),Se=B.useRef(null),me=B.useRef(null),ye=B.useRef(!1);B.useEffect(()=>{c||(E==="KEYBOARD"?Se.current?.focus():(S(ge.map(H=>Q.find(ie=>ie.id===H).char).join("")),me.current?.focus()))},[E,c]);const Ne=H=>{S(H);const ie=[...Q],je=[];for(const de of Array.from(H)){const j=ie.findIndex($=>Da($.char,g.strictAccents)===Da(de,g.strictAccents));j>=0&&je.push(ie.splice(j,1)[0].id)}O(je)},Y=()=>{E==="KEYBOARD"?Se.current?.focus():me.current?.focus()},ee=()=>{c||ye.current||(y(!0),Ne(_g(L,d.targetWord,g.strictAccents)),Y())},J=(H=!1)=>{if(c||ye.current)return;const ie=H?"INCORRECT":Bg(L,d.targetWord,g.strictAccents,N);if(!H&&ie==="INCORRECT"&&(ue.current+=1,ce(ue.current),ue.current<3)){Y(),Se.current?.select();return}ye.current=!0,b(ie)},Ee=H=>{if(c||H.nativeEvent.isComposing||H.repeat||H.ctrlKey||H.metaKey||H.altKey)return;const ie=H.target;H.key==="Escape"?(H.preventDefault(),H.stopPropagation(),J(!0)):H.key==="Tab"&&!H.shiftKey&&(ie===Se.current||ie===me.current)?(H.preventDefault(),H.stopPropagation(),ee()):H.key==="Enter"&&!ie.closest("button")&&(H.preventDefault(),H.stopPropagation(),J())},Me=c==="CORRECT"?"correct":c==="ASSISTED"?"assisted":"incorrect";return r.jsxs("div",{className:"typing-card",onKeyDown:Ee,children:[r.jsx("p",{lang:g.sourceLanguage,className:"typing-translation",children:d.translations.join(" · ")}),c?r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:"typing-correct-word",children:[r.jsx("h2",{lang:g.targetLanguage,children:d.targetWord}),c==="INCORRECT"&&r.jsx("p",{className:"answer-diff","aria-label":A("answerDiff"),lang:g.targetLanguage,children:Hg(L,d.targetWord,g.strictAccents).map((H,ie)=>H.kind==="wrong"?r.jsx("del",{children:H.text},ie):r.jsx("span",{className:H.kind,children:H.text},ie))}),d.transcription&&r.jsx("p",{className:"transcription",children:d.transcription}),r.jsx("button",{className:"audio-button","aria-label":A("listen"),onClick:M,children:r.jsx(lu,{size:20})}),_&&r.jsx("small",{role:"status",children:A("audioError")})]}),r.jsxs("div",{className:`typing-feedback ${Me}`,role:"status",children:[r.jsx("strong",{children:A(Me)}),r.jsx("p",{className:"submitted-answer",children:L||"—"}),r.jsx("p",{children:A(c==="CORRECT"?"correctHint":c==="ASSISTED"?"assistedHint":"incorrectHint")})]}),d.examples.length>0&&r.jsxs("div",{className:"context",children:[r.jsx("span",{className:"eyebrow",children:A("example")}),d.examples.map((H,ie)=>r.jsxs("div",{children:[r.jsx("p",{lang:g.targetLanguage,children:r.jsx(Ug,{sentence:H.targetSentence,target:d.targetWord})}),r.jsx("p",{lang:g.sourceLanguage,className:"muted",children:H.translatedSentence})]},ie))]})]}):r.jsxs(r.Fragment,{children:[r.jsx("p",{className:"typing-instruction",children:A("typePrompt")}),d.examples[0]&&r.jsxs("div",{className:"typing-clues",children:[r.jsx("p",{lang:g.sourceLanguage,children:d.examples[0].translatedSentence}),pu(d.examples[0].targetSentence,d.targetWord)!==d.examples[0].targetSentence&&r.jsx("p",{lang:g.targetLanguage,className:"muted",children:pu(d.examples[0].targetSentence,d.targetWord)})]}),E==="KEYBOARD"?r.jsx("input",{ref:Se,className:"typing-input",type:"text",value:L,maxLength:200,lang:g.targetLanguage,"aria-label":A("answer"),"aria-invalid":Z>0,"aria-describedby":X,autoComplete:"off",autoCorrect:"off",autoCapitalize:"off",spellCheck:!1,onChange:H=>Ne(H.target.value)}):r.jsxs(r.Fragment,{children:[r.jsxs("div",{ref:me,className:"tile-answer",tabIndex:0,role:"group","aria-label":A("answer"),"aria-describedby":X,children:[!ge.length&&r.jsx("span",{className:"muted",children:A("answer")}),ge.map((H,ie)=>{const je=Q.find(de=>de.id===H);return r.jsx("button",{className:"letter-tile inserted","aria-label":`${A("removeLetter")}: ${je.char===" "?A("spaceCharacter"):je.char}`,onClick:()=>{const de=ge.filter((j,$)=>$!==ie);O(de),S(de.map(j=>Q.find($=>$.id===j).char).join("")),Y()},children:je.char===" "?"␣":je.char},H)})]}),r.jsx("div",{className:"tile-bank",role:"group","aria-label":A("tileBank"),children:Q.map(H=>r.jsx("button",{className:"letter-tile",disabled:ge.includes(H.id),"aria-label":H.char===" "?A("spaceCharacter"):H.char,onClick:()=>{O([...ge,H.id]),S(L+H.char),Y()},children:H.char===" "?"␣":H.char},H.id))})]}),r.jsxs("p",{id:X,className:"typing-attempts",role:"status",children:[Z>0&&r.jsxs("span",{children:[A("tryAgain")," "]}),A("attemptsRemaining"),": ",3-Z]}),r.jsxs("div",{className:"typing-controls",children:[r.jsxs("button",{className:"text-button","aria-keyshortcuts":"Tab",onClick:ee,children:[r.jsx(og,{size:16}),A("hint"),r.jsx("kbd",{children:"Tab"})]}),r.jsxs("button",{className:"primary-button","aria-keyshortcuts":"Enter",onClick:()=>J(),children:[A("checkAnswer"),r.jsx(zt,{size:16})]})]}),r.jsxs("button",{className:"typing-give-up text-button","aria-keyshortcuts":"Escape",onClick:()=>J(!0),children:[A("giveUp"),r.jsx("kbd",{children:"Esc"})]})]})]})}function Gg({active:d=!0,pair:g,settings:E,update:c,t:b,openLibrary:M,changeSettings:_,initialSelection:A,reviewOrder:L}){const[S,N]=B.useState("mixed"),[y,Z]=B.useState(A),[ce,ue]=B.useState([]),[X,Q]=B.useState(!1),[ge,O]=B.useState(0),[Se,me]=B.useState([]),[ye,Ne]=B.useState(!1),[Y,ee]=B.useState(null),[J,Ee]=B.useState(!1),[Me,H]=B.useState(!1),[ie,je]=B.useState(!1),[de,j]=B.useState(null),[$,F]=B.useState("KEYBOARD"),[he,pe]=B.useState(0),Ge=B.useRef(null),Fe=B.useRef(!1),Tn=B.useRef(-1),m=ca(g,S,y),z=ca(g,"review",y).length,R=ca(g,"new",y).length,q=ki(g,y),te=q.filter(le=>le.status==="MASTERED").length,oe=q.length>0&&te===q.length,U=g.words.find(le=>le.id===ce[0]),D=!!U&&Ig(U,E.studyMode),P=()=>{j(null),Fe.current=!1,pe(le=>le+1),Ne(!1),je(!1)};B.useEffect(()=>{de&&Ge.current?.focus({preventScroll:!0})},[de]);const Kn=U&&g.categories.find(le=>U.categoryIds.includes(le.id)),zi=()=>{ue(m),Q(!0),O(0),me([]),P(),H(!1)},An=le=>{if(!U||Tn.current===he||D&&!ye)return;Tn.current=he,ee(le),H(!1);const Ue=D&&de==="ASSISTED"&&le==="repeat",Ba=kg(U,le,E,L+1,{assisted:Ue});me(it=>[...it,{cardId:U.id,previousCardState:U,previousQueueIndex:0,queue:[...ce],reviewOrder:L,mode:S,completed:ge}]);const Jn={...g,words:g.words.map(it=>it.id===Ba.id?Ba:it)};c(Jn,L+1);const da=Rg(ce,Jn,S,Ba,Ng(U,le,Ue),y);ue(da.queue),N(da.mode),da.switched&&Ee(!0),O(it=>it+1),P()},Mn=()=>{if(!Se.length)return;const le=Se[Se.length-1];c({...g,words:g.words.map(Ue=>Ue.id===le.cardId?le.previousCardState:Ue)},le.reviewOrder),ue(le.queue),O(le.completed),N(le.mode),Ee(!1),ee(null),me(Se.slice(0,-1)),P(),H(!0)},Ze=()=>{U&&!D&&Ne(!0)},Le=()=>{de&&An(de==="CORRECT"?"know":"repeat")},_n=le=>{!U||Fe.current||(Fe.current=!0,j(le),Ne(!0),je(!mr(U.targetWord,E.targetLanguage)))};Dg(An,D?Le:Ze,Mn,d&&X&&(!D||ye));const{drag:en,handlers:tt}=jg(An,Ze,D&&!ye),at=en.y<-40&&Math.abs(en.y)>Math.abs(en.x)?"master":en.x>0?"know":"repeat",ua=at==="master"?-en.y:Math.abs(en.x),Ot=`translate(${en.x}px, ${en.y}px) rotate(${en.x/100*8}deg)`,Ri=le=>{const Ue=fu(g,le,y);N(Ue),Ee(Ue!==le),me([]),P(),X&&ue(ca(g,Ue,y))};return r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:"page-heading",children:[r.jsxs("div",{children:[r.jsx("p",{className:"eyebrow",children:b("learn")}),r.jsx("h1",{children:b("study")}),r.jsx("p",{className:"subtitle",children:b("studySub")})]}),r.jsxs("div",{className:"study-selectors",children:[r.jsxs("label",{className:"recall-mode-label",children:[b("practiceSelection"),r.jsxs("select",{"aria-label":b("practiceSelection"),value:y?`${y.kind}:${y.id}`:"all",disabled:X&&ce.length>0,onChange:le=>{const Ue=le.target.value;Z(Ue==="all"?void 0:Ue.startsWith("category:")?{kind:"category",id:Ue.slice(9)}:{kind:"word",id:Ue.slice(5)}),Q(!1),N(fu(g,S,Ue==="all"?void 0:Ue.startsWith("category:")?{kind:"category",id:Ue.slice(9)}:{kind:"word",id:Ue.slice(5)})),Ee(!1),ue([]),me([]),P()},children:[r.jsx("option",{value:"all",children:b("allActiveFolders")}),g.categories.map(le=>r.jsx("option",{value:`category:${le.id}`,children:le.name[E.interfaceLanguage]},le.id)),y?.kind==="word"&&r.jsx("option",{value:`word:${y.id}`,children:b("selectedWord")})]})]}),r.jsxs("label",{className:"recall-mode-label",children:[b("studyMode"),r.jsxs("select",{"aria-label":b("studyMode"),value:E.studyMode,disabled:X&&ce.length>0,onChange:le=>_({studyMode:le.target.value}),children:[r.jsx("option",{value:"SWIPE_ONLY",children:b("swipeOnly")}),r.jsx("option",{value:"TYPE_ONLY",children:b("typeOnly")}),r.jsx("option",{value:"MIXED",children:b("mixedRecall")})]})]}),E.studyMode!=="SWIPE_ONLY"&&r.jsxs("label",{className:"recall-mode-label",children:[b("inputMode"),r.jsxs("select",{"aria-label":b("inputMode"),value:$,onChange:le=>F(le.target.value),children:[r.jsx("option",{value:"KEYBOARD",children:b("keyboard")}),r.jsx("option",{value:"TILES",children:b("tiles")})]})]}),r.jsxs("div",{className:"mode-select",children:[r.jsxs("select",{"aria-label":b("session"),value:S,onChange:le=>Ri(le.target.value),children:[r.jsx("option",{value:"mixed",children:b("mixed")}),r.jsx("option",{value:"new",children:b("newMode")}),r.jsx("option",{value:"review",children:b("reviewMode")})]}),r.jsx(au,{size:15})]})]})]}),y&&r.jsx("p",{className:"practice-note",children:b("selectedPracticeHint")}),J&&r.jsx("p",{className:"practice-note",role:"status",children:b("modeSwitched")}),r.jsxs("div",{className:"summary-grid",children:[r.jsxs("div",{children:[r.jsx("span",{className:"stat-dot blue"}),r.jsx("span",{children:b("new")}),r.jsx("strong",{children:R.toString().padStart(2,"0")})]}),r.jsxs("div",{children:[r.jsx("span",{className:"stat-dot amber"}),r.jsx("span",{children:b("review")}),r.jsx("strong",{children:z.toString().padStart(2,"0")})]}),r.jsxs("div",{children:[r.jsx("span",{className:"stat-dot green"}),r.jsx("span",{children:b("mastered")}),r.jsx("strong",{children:te.toString().padStart(2,"0")})]})]}),r.jsxs("section",{className:"study-workspace",children:[r.jsxs("div",{className:"session-bar",children:[r.jsxs("button",{className:"text-button",disabled:!Se.length,onClick:Mn,children:[r.jsx(iu,{size:15}),b("undo")]}),r.jsx("span",{className:"eyebrow",children:b("session")}),r.jsxs("span",{className:"session-count",children:[X?`${ge} ${b("practiced")}`:`${m.length}`," ",r.jsx("span",{children:X?`· ${ce.length} ${b("remaining")}`:""})]})]}),r.jsx("div",{className:"progress-track",children:r.jsx("div",{style:{width:`${q.length?te/q.length*100:0}%`}})}),X&&U?r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:"card-stack",children:[r.jsx("div",{className:"stack-under"}),r.jsxs("article",{...tt,className:`flashcard ${Y?"advance-"+Y:""} ${D?"typing-flashcard":""} ${de?`grade-${de.toLowerCase()}`:""} ${ye?"revealed":""} ${Me?"reverse":""} ${en.active?"dragging":""}`,"aria-label":D&&!ye?`${U.translations.join(" · ")}. ${b("typePrompt")}`:`${U.targetWord}. ${b(D&&ye?"next":"tap")}`,tabIndex:0,style:{transform:Ot,borderColor:en.active&&ua>15?`var(--${at==="know"?"positive":at==="repeat"?"negative":"accent"})`:void 0},children:[r.jsxs("div",{className:"card-top",children:[r.jsx("span",{className:"category-tag",children:Kn?.name[E.interfaceLanguage]}),r.jsxs("span",{className:"card-status",children:[b(U.status==="NEW"?"new":U.status==="LEARNING"?"learning":"review"),U.status!=="NEW"?` ${U.step}/5`:""]})]}),r.jsx("span",{"aria-hidden":"true",className:`swipe-badge ${at}`,style:{opacity:en.active?Math.min(1,ua/100):0},children:b(at)}),D?r.jsx(qg,{card:U,settings:E,inputMode:$,evaluation:de,onEvaluate:_n,onListen:()=>je(!mr(U.targetWord,E.targetLanguage)),audioError:ie,t:b},he):r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:"card-prompt",children:[r.jsx("h2",{lang:E.targetLanguage,children:U.targetWord}),U.transcription&&r.jsx("p",{className:"transcription",children:U.transcription}),r.jsx("button",{className:"audio-button","aria-label":b("listen"),title:b("listen"),onClick:le=>{le.stopPropagation(),je(!mr(U.targetWord,E.targetLanguage))},children:r.jsx(lu,{size:20})}),ie&&r.jsx("small",{role:"status",children:b("audioError")})]}),ye?r.jsxs("div",{className:"card-answer",children:[r.jsx("p",{lang:E.sourceLanguage,className:"translation-text",children:U.translations.join(" · ")}),U.examples.length>0&&r.jsxs("div",{className:"context",children:[r.jsx("span",{className:"eyebrow",children:b("example")}),U.examples.map((le,Ue)=>r.jsxs("div",{children:[r.jsx("p",{lang:E.targetLanguage,children:le.targetSentence}),r.jsx("p",{lang:E.sourceLanguage,className:"muted",children:le.translatedSentence})]},Ue))]})]}):r.jsxs("div",{className:"tap-hint",children:[r.jsx("span",{className:"small-line"}),b("tap"),r.jsx("kbd",{children:"Space"})]})]})]},`${U.id}-${he}`)]}),(!D||ye)&&r.jsxs("div",{className:"action-bar",children:[r.jsxs("button",{className:`action-repeat ${D&&de!=="CORRECT"?"preselected":""}`,onClick:()=>An("repeat"),children:[r.jsx(ag,{size:18}),r.jsx("span",{children:b("repeat")})]}),r.jsxs("button",{ref:Ge,className:`action-reveal ${D?"action-next":""}`,disabled:!D&&ye,onClick:D?Le:Ze,children:[D?r.jsx(zt,{size:18}):r.jsx(ra,{size:18}),r.jsx("span",{children:b(D?"next":"reveal")})]}),r.jsxs("button",{className:`action-know ${D&&de==="CORRECT"?"preselected":""}`,onClick:()=>An("know"),children:[r.jsx("span",{children:b("know")}),r.jsx(zt,{size:18})]})]}),(!D||ye)&&r.jsxs("button",{className:"master-button",onClick:()=>An("master"),children:[r.jsx(lg,{size:14}),b("master")]})]}):r.jsxs("div",{className:"session-empty",children:[r.jsx("div",{className:"empty-icon",children:oe?r.jsx(Ml,{size:28}):r.jsx(ra,{size:28})}),r.jsx("h2",{children:b(oe?"complete":"ready")}),r.jsx("p",{children:oe?b("completeSub"):m.length?`${m.length} ${b("remaining")}. ${b("studySub")}`:b("empty")}),r.jsxs("button",{className:"primary-button",onClick:m.length?zi:M,children:[m.length?b(X?"restart":"start"):b("categories"),r.jsx(zt,{size:17})]})]}),X&&U&&D&&!ye&&r.jsx("p",{className:"typing-keyboard-hints",children:b("typingShortcuts")}),X&&U&&(!D||ye)&&r.jsxs("div",{className:"keyboard-hints",children:[r.jsxs("span",{children:[r.jsx("kbd",{children:"←"})," ",b("repeat")]}),r.jsxs("span",{children:[r.jsx("kbd",{children:D?"Enter / Space":"Space"})," ",b(D?"next":"reveal")]}),r.jsxs("span",{children:[r.jsx("kbd",{children:"→"})," ",b("know")]}),r.jsxs("span",{children:[r.jsx("kbd",{children:"↑"})," ",b("master")]}),r.jsxs("span",{children:[r.jsx("kbd",{children:"Ctrl Z"})," ",b("undo")]})]}),X&&U&&r.jsx("button",{className:"end-session",onClick:()=>{Q(!1),ue([]),me([])},children:b("end")})]})]})}function gu(d){return d.replace(/<[^>]*>/g,"").trim().slice(0,2e3)}async function hu(d,g,E,c){try{const b=new URL("https://api.mymemory.translated.net/get");b.searchParams.set("q",d.trim()),b.searchParams.set("langpair",`${g}|${E}`);const M=AbortSignal.timeout(1e4),_=await fetch(b,{signal:c?AbortSignal.any([c,M]):M});if(!_.ok)throw new Error("Translation unavailable");const A=await _.json();if(Number(A.responseStatus)!==200||typeof A.responseData?.translatedText!="string")throw new Error("Translation unavailable");const L=gu(A.responseData.translatedText);if(!L)throw new Error("Empty translation");const S=[...new Set((Array.isArray(A.matches)?A.matches:[]).flatMap(N=>typeof N.translation=="string"?[gu(N.translation)]:[]))].filter(N=>N&&N!==L).slice(0,5);return{primary:L,alternatives:S}}catch(b){if(c?.aborted)throw b;const M=Cl(E,g).words.find(_=>_.targetWord.toLocaleLowerCase(g)===d.trim().toLocaleLowerCase(g));if(M)return{primary:M.translations[0],alternatives:[],offline:!0};throw new Error("Translation unavailable")}}function vu({pair:d,settings:g,update:E,t:c,existing:b,onClose:M,onPractice:_}){const A=B.useId(),[L,S]=B.useState(b?.targetWord??""),[N,y]=B.useState(b?.translations.join("; ")??""),[Z,ce]=B.useState(b?.transcription??""),[ue,X]=B.useState(b?.examples[0]?.targetSentence??""),[Q,ge]=B.useState(b?.examples[0]?.translatedSentence??""),[O,Se]=B.useState(b?.categoryIds[0]??d.categories[0]?.id??""),[me,ye]=B.useState(""),[Ne,Y]=B.useState([]),[ee,J]=B.useState(!1),[Ee,Me]=B.useState(!1),[H,ie]=B.useState(null),[je,de]=B.useState(!1),[j,$]=B.useState(null),F=B.useRef(null),he=B.useRef(null),pe=B.useRef(!!b),Ge=B.useRef(0),Fe=B.useRef(0),Tn=async(R,q=!1)=>{if(!R.trim()||pe.current&&!q)return;F.current?.abort();const te=new AbortController;F.current=te;const oe=Ge.current;J(!0),ie(null);try{const U=await hu(R,g.targetLanguage,g.sourceLanguage,te.signal);!te.signal.aborted&&oe===Ge.current&&(y(U.primary),Y(U.alternatives),U.offline&&ie("offline"))}catch{!te.signal.aborted&&oe===Ge.current&&ie("translateError")}finally{te.signal.aborted||J(!1)}};B.useEffect(()=>{const R=setTimeout(()=>{Tn(L)},500);return()=>{clearTimeout(R),F.current?.abort()}},[L]),B.useEffect(()=>()=>{F.current?.abort(),he.current?.abort()},[]);const m=async()=>{he.current?.abort();const R=new AbortController;he.current=R;const q=Fe.current;Me(!0),ie(null);try{const te=await hu(ue,g.targetLanguage,g.sourceLanguage,R.signal);!R.signal.aborted&&q===Fe.current&&ge(te.primary)}catch{R.signal.aborted||ie("translateError")}finally{R.signal.aborted||Me(!1)}},z=()=>{F.current?.abort(),he.current?.abort(),Ge.current++,Fe.current++,J(!1),Me(!1);let R=d.categories,q=O;O==="__new"&&me.trim()&&(q=crypto.randomUUID(),R=[...R,{id:q,isCustom:!0,isActiveForStudy:!0,name:Object.fromEntries(Rt.map(U=>[U,me.trim()]))}]);const te=Date.now(),oe={...b??{id:crypto.randomUUID(),status:"NEW",step:0,repCount:0,lastReviewedOrder:0,createdAt:te},targetWord:L.trim(),transcription:Z.trim()||void 0,translations:N.split(";").map(U=>U.trim()).filter(Boolean),examples:ue.trim()?[{targetSentence:ue.trim(),translatedSentence:Q.trim()},...b?.examples.slice(1)??[]]:[],categoryIds:[...new Set([q,...b?.categoryIds.slice(1)??[]])]};E({...d,categories:R,words:b?d.words.map(U=>U.id===b.id?oe:U):[...d.words,oe]}),b?M?.():(S(""),y(""),ce(""),X(""),ge(""),Y([]),ie(null),de(!0),$(oe.id),pe.current=!1,Ge.current++,F.current?.abort(),J(!1),O==="__new"&&(Se(q),ye("")))};return r.jsxs("div",{className:"word-form-wrap",children:[!b&&r.jsx("div",{className:"page-heading",children:r.jsxs("div",{children:[r.jsx("p",{className:"eyebrow",children:c("add")}),r.jsx("h1",{children:c("addTitle")}),r.jsx("p",{className:"subtitle",children:c("addSub")})]})}),r.jsxs("form",{className:"word-form panel",onSubmit:R=>{R.preventDefault(),z()},children:[b&&r.jsxs("div",{className:"dialog-heading",children:[r.jsx("h2",{children:c("edit")}),r.jsx("button",{type:"button",className:"icon-button",onClick:M,"aria-label":c("close"),children:r.jsx(ou,{size:20})})]}),r.jsxs("div",{className:"form-pair",children:[r.jsx(ug,{size:18}),r.jsx("span",{children:sa[g.targetLanguage]}),r.jsx(zt,{size:15}),r.jsx("span",{children:sa[g.sourceLanguage]})]}),r.jsxs("label",{htmlFor:`${A}-word`,children:[c("targetWord"),r.jsxs("div",{className:"input-action",children:[r.jsx("input",{id:`${A}-word`,"aria-label":c("targetWord"),required:!0,autoComplete:"off",maxLength:100,value:L,lang:g.targetLanguage,onChange:R=>{S(R.target.value),pe.current=!1,Ge.current++,de(!1),J(!1),Y([]),ie(null),b||y("")}}),r.jsx("button",{type:"button",className:"inline-button",disabled:!L.trim()||ee,onClick:()=>{Tn(L,!0)},children:c(ee?"translating":"translate")})]})]}),r.jsxs("label",{children:[c("translation"),r.jsx("input",{required:!0,maxLength:1e3,value:N,lang:g.sourceLanguage,onChange:R=>{pe.current=!0,Ge.current++,y(R.target.value)}})]}),Ne.length>0&&r.jsx("div",{className:"translation-chips",children:Ne.map(R=>r.jsxs("button",{type:"button",onClick:()=>{pe.current=!0,Ge.current++,y(q=>[...new Set([...q.split(";").map(te=>te.trim()).filter(Boolean),R])].join("; "))},children:[r.jsx(fr,{size:12}),R]},R))}),H&&r.jsx("p",{className:"form-message",role:"status",children:c(H)}),r.jsxs("label",{children:[c("transcription"),r.jsx("input",{maxLength:200,value:Z,onChange:R=>ce(R.target.value)})]}),r.jsx("div",{className:"form-divider"}),r.jsxs("label",{children:[c("context"),r.jsx("textarea",{maxLength:1e3,rows:2,value:ue,lang:g.targetLanguage,onChange:R=>{Fe.current++,X(R.target.value)}})]}),r.jsxs("label",{htmlFor:`${A}-sentence-translation`,children:[r.jsxs("span",{className:"label-action",children:[c("contextTranslation"),r.jsx("button",{className:"inline-button","aria-label":`${c("translate")}: ${c("context")}`,type:"button",disabled:!ue.trim()||Ee,onClick:()=>{m()},children:c(Ee?"translating":"translate")})]}),r.jsx("textarea",{id:`${A}-sentence-translation`,"aria-label":c("contextTranslation"),maxLength:2e3,rows:2,value:Q,lang:g.sourceLanguage,onChange:R=>{Fe.current++,ge(R.target.value)}})]}),r.jsxs("label",{children:[c("folder"),r.jsxs("select",{required:!0,value:O,onChange:R=>Se(R.target.value),children:[d.categories.map(R=>r.jsx("option",{value:R.id,children:R.name[g.interfaceLanguage]},R.id)),r.jsxs("option",{value:"__new",children:["+ ",c("newFolder")]})]})]}),O==="__new"&&r.jsxs("label",{children:[c("folderName"),r.jsx("input",{required:!0,maxLength:80,value:me,onChange:R=>ye(R.target.value)})]}),r.jsxs("button",{className:"primary-button",disabled:!L.trim()||!N.trim()||!O||O==="__new"&&!me.trim(),type:"submit",children:[c(b?"saveChanges":"save"),r.jsx(zt,{size:17})]}),je&&r.jsxs("p",{className:"success-message",role:"status",children:[r.jsx(Ml,{size:16}),c("saved")]}),je&&j&&_&&r.jsxs("button",{type:"button",className:"outline-button",onClick:()=>_({kind:"word",id:j}),children:[c("practiceSavedWord"),r.jsx(zt,{size:17})]})]})]})}function Vg({pair:d,settings:g,update:E,t:c,onPractice:b}){const[M,_]=B.useState(""),[A,L]=B.useState("all"),[S,N]=B.useState(""),[y,Z]=B.useState(!1),[ce,ue]=B.useState(null),X=B.useRef(null);B.useEffect(()=>{ce?X.current?.showModal():X.current?.close()},[ce]);const Q=d.words.filter(O=>(A==="all"||O.categoryIds.includes(A))&&`${O.targetWord} ${O.translations.join(" ")}`.toLocaleLowerCase(g.interfaceLanguage).includes(M.toLocaleLowerCase(g.interfaceLanguage))),ge=O=>E({...d,words:d.words.map(Se=>Se.id===O.id?O:Se)});return r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:"page-heading",children:[r.jsxs("div",{children:[r.jsx("p",{className:"eyebrow",children:c("categories")}),r.jsx("h1",{children:c("libraryTitle")}),r.jsx("p",{className:"subtitle",children:c("librarySub")})]}),r.jsxs("button",{className:"outline-button",onClick:()=>Z(!y),children:[r.jsx(fr,{size:17}),c("newFolder")]})]}),y&&r.jsxs("form",{className:"folder-create panel",onSubmit:O=>{O.preventDefault(),S.trim()&&(E({...d,categories:[...d.categories,{id:crypto.randomUUID(),isCustom:!0,isActiveForStudy:!0,name:Object.fromEntries(Rt.map(Se=>[Se,S.trim()]))}]}),N(""),Z(!1))},children:[r.jsx("input",{required:!0,autoFocus:!0,"aria-label":c("folderName"),placeholder:c("folderName"),maxLength:80,value:S,onChange:O=>N(O.target.value)}),r.jsxs("button",{className:"primary-button",type:"submit",children:[r.jsx(Ml,{size:17}),c("saveChanges")]}),r.jsx("button",{type:"button",className:"icon-button","aria-label":c("cancel"),onClick:()=>Z(!1),children:r.jsx(ou,{size:18})})]}),r.jsx("div",{className:"category-grid",children:d.categories.map((O,Se)=>{const me=d.words.filter(Y=>Y.categoryIds.includes(O.id)),ye=me.filter(Y=>Y.status==="MASTERED").length,Ne=me.filter(Y=>Y.status==="NEW"||Y.status==="LEARNING").length;return r.jsxs("section",{className:`category-panel panel ${A===O.id?"selected":""}`,children:[r.jsxs("div",{className:"category-panel-top",children:[r.jsx(cg,{size:22}),r.jsx("span",{className:"category-number",children:(Se+1).toString().padStart(2,"0")})]}),r.jsxs("button",{className:"category-name",onClick:()=>L(A===O.id?"all":O.id),children:[O.name[g.interfaceLanguage],r.jsx(ig,{size:17})]}),r.jsxs("p",{className:"category-total",children:[me.length," ",c("total").toLocaleLowerCase(g.interfaceLanguage)]}),r.jsx("div",{className:"category-progress",children:r.jsx("div",{style:{width:`${me.length?ye/me.length*100:0}%`}})}),r.jsxs("div",{className:"category-stats",children:[r.jsxs("span",{children:[Ne," ",c("learning")]}),r.jsxs("span",{children:[ye," ",c("mastered")]})]}),r.jsxs("button",{className:"category-practice outline-button","aria-label":`${c("practice")}: ${O.name[g.interfaceLanguage]}`,disabled:!me.some(Y=>Y.status!=="MASTERED"),onClick:()=>b({kind:"category",id:O.id}),children:[r.jsx(ra,{size:15}),c("practice")]}),r.jsxs("label",{className:"checkbox-row",children:[r.jsx("input",{type:"checkbox",checked:O.isActiveForStudy,onChange:Y=>E({...d,categories:d.categories.map(ee=>ee.id===O.id?{...ee,isActiveForStudy:Y.target.checked}:ee)})}),c("active")]}),r.jsx("div",{className:"folder-reset-actions",children:["NEW","REVIEW"].map(Y=>r.jsx("button",{className:"text-button",onClick:()=>E({...d,words:d.words.map(ee=>ee.categoryIds.includes(O.id)?Nl(ee,Y):ee)}),children:c(Y==="NEW"?"resetNew":"resetReview")},Y))})]},O.id)})}),r.jsxs("div",{className:"library-toolbar",children:[r.jsxs("div",{className:"search-field",children:[r.jsx(pg,{size:18}),r.jsx("input",{"aria-label":c("search"),placeholder:c("search"),value:M,onChange:O=>_(O.target.value)})]}),r.jsxs("select",{"aria-label":c("folder"),value:A,onChange:O=>L(O.target.value),children:[r.jsx("option",{value:"all",children:c("all")}),d.categories.map(O=>r.jsx("option",{value:O.id,children:O.name[g.interfaceLanguage]},O.id))]})]}),r.jsxs("div",{className:"word-table panel",children:[r.jsxs("div",{className:"word-table-header",children:[r.jsxs("span",{children:[c("word")," / ",c("translation")]}),r.jsx("span",{children:c("status")}),r.jsx("span",{})]}),Q.length?Q.map(O=>r.jsxs("div",{className:"word-row",children:[r.jsxs("button",{className:"word-detail",onClick:()=>ue(O),children:[r.jsx("strong",{lang:g.targetLanguage,children:O.targetWord}),r.jsx("span",{lang:g.sourceLanguage,children:O.translations.join("; ")})]}),r.jsx("span",{className:`status-pill ${O.status.toLowerCase()}`,children:c(O.status==="NEW"?"new":O.status==="LEARNING"?"learning":O.status==="REVIEW"?"review":"mastered")}),r.jsxs("div",{className:"row-actions",children:[r.jsx("button",{className:"icon-button",title:c("resetReview"),"aria-label":`${c("resetReview")}: ${O.targetWord}`,onClick:()=>ge(Nl(O,"REVIEW")),children:r.jsx(mg,{size:16})}),r.jsx("button",{className:"icon-button",title:c("practice"),"aria-label":`${c("practice")}: ${O.targetWord}`,disabled:O.status==="MASTERED",onClick:()=>b({kind:"word",id:O.id}),children:r.jsx(ra,{size:16})}),r.jsx("button",{className:"icon-button",title:c("reset"),"aria-label":`${c("reset")}: ${O.targetWord}`,onClick:()=>ge(Nl(O)),children:r.jsx(iu,{size:16})}),r.jsx("button",{className:"icon-button",title:O.status==="MASTERED"?c("reset"):c("master"),"aria-label":`${O.status==="MASTERED"?c("reset"):c("master")}: ${O.targetWord}`,onClick:()=>ge(O.status==="MASTERED"?Nl(O):{...O,status:"MASTERED",step:5}),children:r.jsx(Ml,{size:16})})]})]},O.id)):r.jsxs("div",{className:"no-results",children:[r.jsx(ra,{size:24}),r.jsx("p",{children:c("noResults")})]})]}),r.jsx("dialog",{ref:X,className:"edit-dialog","aria-label":c("edit"),onCancel:()=>ue(null),onClick:O=>{O.target===O.currentTarget&&ue(null)},children:ce&&r.jsx(vu,{pair:d,settings:g,update:E,t:c,onPractice:b,existing:ce,onClose:()=>ue(null)},ce.id)})]})}function pr({label:d,value:g,onChange:E,exclude:c}){return r.jsxs("label",{children:[d,r.jsx("select",{value:g,onChange:b=>E(b.target.value),children:Rt.filter(b=>b!==c).map(b=>r.jsx("option",{value:b,children:sa[b]},b))})]})}function Yg({data:d,changeSettings:g,restore:E,t:c}){const b=B.useRef(null),[M,_]=B.useState(!1),A=d.settings,L=()=>{const S=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),N=URL.createObjectURL(S),y=document.createElement("a");y.href=N,y.download=`erudite-backup-${new Date().toISOString().slice(0,10)}.json`,y.click(),setTimeout(()=>URL.revokeObjectURL(N),1e3)};return r.jsxs(r.Fragment,{children:[r.jsx("div",{className:"page-heading",children:r.jsxs("div",{children:[r.jsx("p",{className:"eyebrow",children:c("settings")}),r.jsx("h1",{children:c("settingsTitle")}),r.jsx("p",{className:"subtitle",children:c("settingsSub")})]})}),r.jsxs("div",{className:"settings-columns",children:[r.jsxs("section",{className:"panel settings-panel",children:[r.jsx("h2",{children:c("language")}),r.jsx(pr,{label:c("interface"),value:A.interfaceLanguage,onChange:S=>g({interfaceLanguage:S})}),r.jsxs("div",{className:"form-two",children:[r.jsx(pr,{label:c("source"),value:A.sourceLanguage,exclude:A.targetLanguage,onChange:S=>g({sourceLanguage:S})}),r.jsx(pr,{label:c("target"),value:A.targetLanguage,exclude:A.sourceLanguage,onChange:S=>g({targetLanguage:S})})]}),r.jsxs("div",{className:"setting-toggle",children:[r.jsxs("div",{children:[r.jsx("label",{htmlFor:"strict-accents",children:c("strictAccents")}),r.jsx("p",{children:c("strictAccentsHint")})]}),r.jsx("input",{id:"strict-accents",type:"checkbox",role:"switch",checked:A.strictAccents,onChange:S=>g({strictAccents:S.target.checked})})]}),r.jsxs("label",{children:[c("studyMode"),r.jsxs("select",{value:A.studyMode,onChange:S=>g({studyMode:S.target.value}),children:[r.jsx("option",{value:"SWIPE_ONLY",children:c("swipeOnly")}),r.jsx("option",{value:"TYPE_ONLY",children:c("typeOnly")}),r.jsx("option",{value:"MIXED",children:c("mixedRecall")})]})]}),r.jsx("p",{className:"form-message",children:c("mixedRecallHint")}),r.jsxs("div",{className:"setting-toggle",children:[r.jsxs("div",{children:[r.jsx("label",{htmlFor:"instant-master",children:c("instant")}),r.jsx("p",{children:c("instantHint")})]}),r.jsx("input",{id:"instant-master",type:"checkbox",role:"switch",checked:A.instantMasterOnFirstTry,onChange:S=>g({instantMasterOnFirstTry:S.target.checked})})]})]}),r.jsxs("div",{children:[r.jsxs("section",{className:"panel settings-panel",children:[r.jsx("h2",{children:c("appearance")}),r.jsx("div",{className:"theme-options",children:["light","dark"].map(S=>r.jsxs("button",{className:A.theme===S?"active":"",onClick:()=>g({theme:S}),children:[r.jsxs("span",{className:`theme-preview ${S}`,children:[r.jsx("i",{}),r.jsx("i",{}),r.jsx("i",{})]}),c(S)]},S))})]}),r.jsxs("section",{className:"panel settings-panel data-panel",children:[r.jsx("h2",{children:c("data")}),r.jsx("p",{className:"muted",children:c("local")}),r.jsxs("button",{className:"outline-button",onClick:L,children:[r.jsx(sg,{size:17}),c("export")]}),r.jsxs("button",{className:"text-button",onClick:()=>b.current?.click(),children:[r.jsx(bg,{size:17}),c("import")]}),r.jsx("input",{ref:b,type:"file",accept:"application/json,.json",className:"sr-only","aria-label":c("import"),onChange:async S=>{const N=S.target.files?.[0];if(N){_(!1);try{if(N.size>1e7)throw new Error("Too large");const y=du(JSON.parse(await N.text()));window.confirm(c("importConfirm"))&&E(y)}catch{_(!0)}finally{S.target.value=""}}}}),M&&r.jsx("p",{role:"alert",className:"form-message",children:c("importError")})]})]})]})]})}const Xg=`<div class="main-container" id="main-container">
    <div class="board-area" id="board-area">
        <div class="board-wrapper" id="board-wrapper">
            <div id="eval-bar-container" class="hidden">
                <div id="eval-score">0.0</div>
                <div id="eval-fill"></div>
            </div>
            <svg id="arrow-overlay"></svg>
            <div id="board" class="board-theme-green"></div>
        </div>

        <div id="training-note-display" class="training-note">
            <div class="note-content">
                <svg class="chess-icon icon-info-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 11v6m0-10v.1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"/></svg>
                <span id="note-text"></span>
            </div>
            <button class="continue-btn" onclick="continueFromNote()">Weiter</button>
        </div>
    </div>

    <div class="resizer" id="resizer"></div>

    <div class="controls-area" id="controls-area">
        <div class="header-row">
            <h2><svg class="chess-icon icon-chess-knight" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 21h14l-2-5V8l-4-5-3 2-4 1-3 7 4 2 4-5M10 21l2-7"/></svg> Trainer</h2>
            <button class="settings-btn" onclick="openSettings()" title="Einstellungen"><svg class="chess-icon icon-gear" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/></svg></button>
        </div>

        <div id="view-mode">
            <div class="view-mode-header">
                <div class="color-switch">
                    <button class="color-btn active" onclick="setSide('white')">Weiß</button>
                    <button class="color-btn" onclick="setSide('black')">Schwarz</button>
                </div>
                <button class="mobile-board-toggle" id="mobile-board-toggle" onclick="toggleMobileBoard()" title="Brett anzeigen">
                    <svg class="chess-icon icon-chess-board" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h18v18H3ZM9 3v18M15 3v18M3 9h18M3 15h18"/></svg>
                </button>
                <button class="analyze-btn" onclick="toggleEvalBar()" id="btn-eval-bar" title="Bewertung anzeigen">
                    <svg class="chess-icon icon-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0"/></svg>
                </button>
            </div>
            <div id="search-active-banner" class="search-banner hidden">
                <span><svg class="chess-icon icon-filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h18l-7 8v8l-4 2V11Z"/></svg> Filter aktiv</span>
                <button onclick="resetBoardSearch()">Reset</button>
            </div>
            <div id="lines-list" class="scrollable-list"></div>
            <div class="action-group">
                <button class="action-btn" onclick="startAddingLine()"><svg class="chess-icon icon-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg> Neu</button>
                <button class="action-btn secondary" onclick="openImportPgn()"><svg class="chess-icon icon-file-import" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H4v20h16V8ZM14 2v6h6M7 14h10m-4-4 4 4-4 4"/></svg> Import</button>
                <button class="action-btn secondary" onclick="openSelectionMode()"><svg class="chess-icon icon-play" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg> Üben</button>
            </div>
        </div>

        <!-- PGN Import Mode -->
        <div id="import-pgn-mode" class="hidden">
            <div class="add-mode-header">
                <h2>PGN Import</h2>
            </div>

            <div id="import-filter-banner" class="search-banner hidden">
                <span><svg class="chess-icon icon-filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h18l-7 8v8l-4 2V11Z"/></svg> Filter aktiv</span>
                <button onclick="resetImportFilter()">Reset</button>
            </div>

            <div id="import-mode-sections">
                <!-- Category input -->
                <div class="add-mode-element">
                    <input type="text" id="import-category-input" list="category-datalist" placeholder="Kategorie (z.B. Sizilianisch)...">
                </div>

                <!-- PGN textarea -->
                <div class="add-mode-element">
                    <textarea id="import-pgn-input" class="note-input import-pgn-textarea" placeholder="PGN einfügen"></textarea>
                </div>

                <!-- Preview section (like analysis/database sections) -->
                <div class="add-mode-element">
                    <div class="import-preview-section hidden" id="import-preview">
                        <div class="explorer-moves" id="import-lines-list"></div>
                    </div>
                </div>
            </div>

            <div class="action-group">
                <button class="action-btn" onclick="executeImportPgn()" id="import-execute-btn" disabled><svg class="chess-icon icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg> Importieren</button>
                <button class="action-btn secondary" onclick="cancelImportPgn()">Abbrechen</button>
            </div>
        </div>

        <div id="bot-setup-mode" class="hidden">
             <div class="bot-setup-header">
                <h2 class="bot-setup-title">Gegen Bot spielen</h2>
            </div>
            <div class="settings-container">
                <div class="training-card bot-setup-card">
                    <div class="category-label">Bot Stärke (ELO)</div>
                    <div class="active-category-title" id="elo-display">1500</div>
                    <input type="range" id="elo-slider" min="500" max="3300" step="50" value="1500" oninput="updateEloDisplay(this.value)">
                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted);">
                        <span>Anfänger (500)</span>
                        <span>Großmeister (3300)</span>
                    </div>
                </div>

                <div class="training-card bot-setup-card">
                    <div class="category-label">Spielstil (Optional)</div>
                    <div class="bot-style-options">
                        <button class="bot-style-btn active" data-style="neutral" onclick="selectBotStyle('neutral')">
                            <svg class="chess-icon icon-balance-scale" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18M5 21h14M3 7h18M6 7l-4 7h8ZM18 7l-4 7h8Z"/></svg>
                            <span>Neutral</span>
                        </button>
                        <button class="bot-style-btn" data-style="greedy" onclick="selectBotStyle('greedy')">
                            <svg class="chess-icon icon-coins" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7c0-5 14-5 14 0s-14 5-14 0v7c0 5 14 5 14 0V7M17 10c6 0 6 10 0 10"/></svg>
                            <span>Materialist</span>
                        </button>
                        <button class="bot-style-btn" data-style="tactical" onclick="selectBotStyle('tactical')">
                            <svg class="chess-icon icon-bolt" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m13 2-9 12h7l-1 8 10-13h-7Z"/></svg>
                            <span>Taktiker</span>
                        </button>
                        <button class="bot-style-btn" data-style="positional" onclick="selectBotStyle('positional')">
                            <svg class="chess-icon icon-chess" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21h14M7 18h10L14 8h-4ZM9 5h6M12 2v6"/></svg>
                            <span>Stratege</span>
                        </button>
                    </div>
                    <div class="bot-style-description" id="bot-style-description">Ausgewogener Spielstil ohne besondere Präferenzen.</div>
                </div>

                <div class="training-card">
                    <div class="category-label">Ausgewählte Variante</div>
                    <div id="bot-line-preview" class="bot-line-preview"></div>
                </div>
            </div>
             <div class="action-group">
                <button class="action-btn" onclick="launchBotGame()"><svg class="chess-icon icon-robot" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16v14H4ZM12 2v4M8 11h1m6 0h1M8 16h8M1 10v6m22-6v6"/></svg> Spiel starten</button>
                <button class="action-btn secondary" onclick="switchUI('view-mode')">Abbrechen</button>
            </div>
        </div>

        <div id="bot-play-mode" class="hidden">
            <div class="training-dashboard">
                <div class="training-card">
                    <div class="category-label">Gegner</div>
                    <div class="active-category-title">Stockfish <span style="font-size:1rem; color:var(--text-muted);" id="bot-play-elo"></span></div>
                    <div class="bot-play-style" id="bot-play-style"></div>
                    <div class="status-badge neutral" id="bot-status">Viel Erfolg!</div>
                </div>
            </div>
            <div class="action-group">
                <button class="action-btn secondary danger-text" onclick="stopBotGame()">Spiel beenden</button>
            </div>
        </div>

        <div id="settings-mode" class="hidden">
            <div class="settings-mode-header">
                <h2>Einstellungen</h2>
                <button class="settings-btn" onclick="closeSettings()"><svg class="chess-icon icon-times" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button>
            </div>
            <div class="settings-container">
                <div class="settings-section">
                    <span class="settings-label">Datenverwaltung (Speichern & Laden)</span>
                    <div class="data-management-box">
                        <p>
                            Deine Daten werden automatisch in diesem Browser gespeichert.
                            Um sie auf ein anderes Gerät zu übertragen, nutze diese Buttons:
                        </p>
                        <div class="data-management-actions">
                            <button class="action-btn secondary" onclick="exportRepertoirePgn()">PGN exportieren</button>
                            <button class="action-btn secondary" onclick="exportData()"><svg class="chess-icon icon-download" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/></svg> Backup speichern</button>
                            <button class="action-btn secondary" onclick="document.getElementById('import-file').click()"><svg class="chess-icon icon-upload" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4m-5 5 5-5 5 5M4 17v4h16v-4"/></svg> Backup laden</button>
                            <input type="file" id="import-file" onchange="importData(this)">
                        </div>
                    </div>
                </div>

                    <div class="settings-section">
                        <span class="settings-label">Darstellung</span>
                    <div class="toggle-row" onclick="toggleThemeSetting()" id="setting-theme-row">
                        <span>Dark Mode</span><div class="toggle-switch"></div>
                    </div>
                    <div class="toggle-row" onclick="toggleSetting('treeView')" id="setting-treeview-row">
                        <span>Baum-Notation (Tree View)</span><div class="toggle-switch"></div>
                    </div>
                    <div class="toggle-row" onclick="toggleSetting('roundedCorners')" id="setting-rounded-row">
                        <span>Abgerundete Ecken</span><div class="toggle-switch"></div>
                    </div>
                </div>
                <div class="settings-section">
                    <span class="settings-label">Gameplay</span>
                    <div class="toggle-row" onclick="toggleSetting('sound')" id="setting-sound-row"><span>Soundeffekte</span><div class="toggle-switch"></div></div>
                    <div class="toggle-row" onclick="toggleSetting('coords')" id="setting-coords-row"><span>Koordinaten</span><div class="toggle-switch"></div></div>
                    <div class="toggle-row" onclick="toggleSetting('highlight')" id="setting-highlight-row"><span>Zug hervorheben</span><div class="toggle-switch"></div></div>
                    <div class="toggle-row" onclick="toggleSetting('autoRepeat')" id="setting-autorepeat-row"><span>Auto-Wiederholung bei Fehler</span><div class="toggle-switch"></div></div>
                    <div class="toggle-row" onclick="toggleSortMode()" id="setting-sortmode-row"><span>Sortierung nach Können</span><div class="toggle-switch"></div></div>
                </div>
                <div class="settings-section">
                    <span class="settings-label">Animationen</span>
                    <div class="options-grid">
                        <div class="option-card" onclick="setAnimSpeed(300)" id="opt-anim-300">Slow</div>
                        <div class="option-card" onclick="setAnimSpeed(150)" id="opt-anim-150">Normal</div>
                        <div class="option-card" onclick="setAnimSpeed(0)" id="opt-anim-0">Aus</div>
                    </div>
                </div>
                <div class="settings-section">
                    <span class="settings-label">Brett Design</span>
                    <div class="options-grid">
                        <div class="option-card" onclick="setBoardColor('green')" id="opt-board-green"><span class="color-dot color-dot-green"></span></div>
                        <div class="option-card" onclick="setBoardColor('brown')" id="opt-board-brown"><span class="color-dot color-dot-brown"></span></div>
                        <div class="option-card" onclick="setBoardColor('blue')" id="opt-board-blue"><span class="color-dot color-dot-blue"></span></div>
                        <div class="option-card" onclick="setBoardColor('gray')" id="opt-board-gray"><span class="color-dot color-dot-gray"></span></div>
                        <div class="option-card" onclick="setBoardColor('purple')" id="opt-board-purple"><span class="color-dot color-dot-purple"></span></div>
                        <div class="option-card" onclick="setBoardColor('teal')" id="opt-board-teal"><span class="color-dot color-dot-teal"></span></div>
                    </div>
                </div>
                <div class="settings-section">
                    <span class="settings-label">Figuren</span>
                    <div class="options-grid">
                        <div class="option-card" onclick="setPieceTheme('wikipedia')" id="opt-piece-wikipedia">Standard</div>
                        <div class="option-card" onclick="setPieceTheme('alpha')" id="opt-piece-alpha">Alpha</div>
                        <div class="option-card" onclick="setPieceTheme('uscf')" id="opt-piece-uscf">USCF</div>
                        <div class="option-card" onclick="setPieceTheme('merida')" id="opt-piece-merida">Merida</div>
                        <div class="option-card" onclick="setPieceTheme('maestro')" id="opt-piece-maestro">Maestro</div>
                        <div class="option-card" onclick="setPieceTheme('leipzig')" id="opt-piece-leipzig">Leipzig</div>
                        <div class="option-card" onclick="setPieceTheme('tatiana')" id="opt-piece-tatiana">Tatiana</div>
                        <div class="option-card" onclick="setPieceTheme('cardinal')" id="opt-piece-cardinal">Cardinal</div>
                        <div class="option-card" onclick="setPieceTheme('blindfold')" id="opt-piece-blindfold">Blindfold</div>
                    </div>
                </div>
                <div class="settings-section">
                    <span class="settings-label">Varianten-Editor Reihenfolge</span>
                    <div class="order-list" id="editor-order-list">
                        <div class="order-item" data-key="name"><svg class="chess-icon icon-grip-lines" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg><span>Kategorie</span><div class="order-arrows"><button onclick="moveOrderItem('name', -1)"><svg class="chess-icon icon-chevron-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg></button><button onclick="moveOrderItem('name', 1)"><svg class="chess-icon icon-chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button></div></div>
                        <div class="order-item" data-key="stockfish"><svg class="chess-icon icon-grip-lines" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg><span>Stockfish Analyse</span><div class="order-arrows"><button onclick="moveOrderItem('stockfish', -1)"><svg class="chess-icon icon-chevron-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg></button><button onclick="moveOrderItem('stockfish', 1)"><svg class="chess-icon icon-chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button></div></div>
                        <div class="order-item" data-key="database"><svg class="chess-icon icon-grip-lines" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg><span>Datenbank</span><div class="order-arrows"><button onclick="moveOrderItem('database', -1)"><svg class="chess-icon icon-chevron-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg></button><button onclick="moveOrderItem('database', 1)"><svg class="chess-icon icon-chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button></div></div>
                        <div class="order-item" data-key="moves"><svg class="chess-icon icon-grip-lines" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg><span>Züge</span><div class="order-arrows"><button onclick="moveOrderItem('moves', -1)"><svg class="chess-icon icon-chevron-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg></button><button onclick="moveOrderItem('moves', 1)"><svg class="chess-icon icon-chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button></div></div>
                    </div>
                </div>
            </div>
        </div>

        <div id="add-mode" class="hidden">
            <div class="add-mode-header">
                <h2>Neue Variante</h2>
                <div class="add-mode-buttons">
                    <button class="analyze-btn" onclick="toggleAnalysisMenu()" id="btn-analysis">
                        <svg class="chess-icon icon-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0"/></svg> Analyse
                    </button>
                    <button class="analyze-btn" onclick="toggleDatabaseMenu()" id="btn-database">
                        <svg class="chess-icon icon-database" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6c0-5 18-5 18 0s-18 5-18 0v12c0 5 18 5 18 0V6M3 12c0 5 18 5 18 0"/></svg> Datenbank
                    </button>
                    <div class="arrow-btn-wrapper">
                        <button class="analyze-btn mobile-arrow-btn" onclick="toggleArrowDrawMode()" id="btn-arrow-draw" title="Pfeile zeichnen">
                            <svg class="chess-icon icon-long-arrow-alt-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h18m-6-6 6 6-6 6"/></svg>
                        </button>
                        <div class="arrow-color-popup hidden" id="arrow-color-popup">
                            <button class="arrow-color-btn active" data-color="green" onclick="setArrowColor('green'); event.stopPropagation();" style="background:#22c55e"></button>
                            <button class="arrow-color-btn" data-color="red" onclick="setArrowColor('red'); event.stopPropagation();" style="background:#ef4444"></button>
                            <button class="arrow-color-btn" data-color="blue" onclick="setArrowColor('blue'); event.stopPropagation();" style="background:#3b82f6"></button>
                            <button class="arrow-color-btn" data-color="yellow" onclick="setArrowColor('yellow'); event.stopPropagation();" style="background:#eab308"></button>
                        </div>
                    </div>
                    <div class="arrow-btn-wrapper">
                        <button class="analyze-btn mobile-arrow-btn" onclick="toggleCircleDrawMode()" id="btn-circle-draw" title="Kreise zeichnen">
                            <svg class="chess-icon icon-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"/></svg>
                        </button>
                        <div class="arrow-color-popup hidden" id="circle-color-popup">
                            <button class="arrow-color-btn active" data-color="green" onclick="setCircleColor('green'); event.stopPropagation();" style="background:#22c55e"></button>
                            <button class="arrow-color-btn" data-color="red" onclick="setCircleColor('red'); event.stopPropagation();" style="background:#ef4444"></button>
                            <button class="arrow-color-btn" data-color="blue" onclick="setCircleColor('blue'); event.stopPropagation();" style="background:#3b82f6"></button>
                            <button class="arrow-color-btn" data-color="yellow" onclick="setCircleColor('yellow'); event.stopPropagation();" style="background:#eab308"></button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- All orderable sections container -->
            <div id="add-mode-sections">
                <!-- Category/Name input -->
                <div class="add-mode-element" data-element="name">
                    <input type="text" id="category-input" list="category-datalist" placeholder="Kategorie (z.B. Sizilianisch)...">
                    <datalist id="category-datalist"></datalist>
                </div>

                <!-- Stockfish Analysis Section -->
                <div class="add-mode-element" data-element="stockfish">
                    <div class="analysis-section hidden" id="analysis-section">
                        <div class="explorer-header">
                            <svg class="chess-icon icon-robot" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16v14H4ZM12 2v4M8 11h1m6 0h1M8 16h8M1 10v6m22-6v6"/></svg>
                            <span>Stockfish Analyse</span>
                            <div class="analysis-controls">
                                <select id="analysis-lines-select" onchange="updateAnalysisLines(this.value)">
                                    <option value="1">1 Linie</option>
                                    <option value="2">2 Linien</option>
                                    <option value="3">3 Linien</option>
                                    <option value="4">4 Linien</option>
                                    <option value="5" selected>5 Linien</option>
                                </select>
                                <select id="analysis-depth-select" onchange="updateAnalysisDepth(this.value)">
                                    <option value="12">Tiefe 12</option>
                                    <option value="16">Tiefe 16</option>
                                    <option value="20" selected>Tiefe 20</option>
                                    <option value="24">Tiefe 24</option>
                                    <option value="28">Tiefe 28</option>
                                    <option value="99">∞ Unbegrenzt</option>
                                </select>
                                <span class="analysis-depth" id="analysis-depth"></span>
                            </div>
                        </div>
                        <div class="explorer-moves" id="analysis-moves">
                            <div class="explorer-placeholder">Analysiere...</div>
                        </div>
                    </div>
                </div>

                <!-- Opening Explorer Section -->
                <div class="add-mode-element" data-element="database">
                    <div class="explorer-section hidden" id="explorer-section">
                        <div class="explorer-header">
                            <svg class="chess-icon icon-database" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6c0-5 18-5 18 0s-18 5-18 0v12c0 5 18 5 18 0V6M3 12c0 5 18 5 18 0"/></svg>
                            <span>Lichess Datenbank</span>
                            <select id="explorer-source-select" aria-label="Opening database" onchange="updateOpeningExplorer()"><option value="lichess">Lichess</option><option value="masters">Masters</option></select>
                            <span class="explorer-stats" id="explorer-stats"></span>
                        </div>
                        <div class="explorer-auth">
                            <label for="explorer-api-token">Lichess API token</label>
                            <input id="explorer-api-token" type="password" autocomplete="off" placeholder="Token für diese Sitzung" onchange="explorerCache = {}; updateOpeningExplorer()">
                            <a href="https://lichess.org/account/oauth/token/create" target="_blank" rel="noopener noreferrer">Token erstellen</a>
                        </div>
                        <div class="explorer-moves" id="explorer-moves">
                            <div class="explorer-placeholder">Züge spielen...</div>
                        </div>
                    </div>
                </div>

                <!-- PGN/Moves display -->
                <div class="add-mode-element" data-element="moves">
                    <div id="pgn-display"></div>
                </div>
            </div>
            <div class="action-group">
                <button class="action-btn" onclick="saveLine()" id="save-btn">Speichern</button>
                <button class="action-btn secondary" onclick="cancelAdd()">Abbrechen</button>
            </div>
        </div>

        <div id="selection-mode" class="hidden">
            <div class="selection-mode-header">
                <div class="color-switch">
                    <button class="color-btn active" onclick="setSide('white')">Weiß</button>
                    <button class="color-btn" onclick="setSide('black')">Schwarz</button>
                </div>
                <button class="mobile-board-toggle" onclick="toggleMobileBoard()" title="Brett anzeigen">
                    <svg class="chess-icon icon-chess-board" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h18v18H3ZM9 3v18M15 3v18M3 9h18M3 15h18"/></svg>
                </button>
            </div>
            <div id="selection-search-banner" class="search-banner hidden">
                <span><svg class="chess-icon icon-filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h18l-7 8v8l-4 2V11Z"/></svg> Filter aktiv</span>
                <button onclick="resetSelectionBoardSearch()">Reset</button>
            </div>
            <input type="search" id="search-input" placeholder="Suche..." oninput="renderSelectionList()">
            <div id="selection-list" class="scrollable-list"></div>
            <div class="action-group">
                <button class="action-btn" onclick="startTrainingFromSelection()">Starten</button>
                <button class="action-btn secondary" onclick="switchUI('view-mode')">Zurück</button>
            </div>
        </div>

        <div id="train-mode" class="hidden">
            <div class="training-dashboard">
                <div class="training-card">
                    <div class="progress-text">
                        <span id="progress-text-left">Fortschritt</span>
                        <span id="progress-text-right">0 / 0</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>

                    <div class="category-label">Aktuelle Variante</div>
                    <div class="active-category-title" id="train-category-display"></div>

                    <div class="status-badge neutral" id="train-status">Du bist dran</div>
                </div>
            </div>

            <div class="action-group">
                <button class="action-btn repetition" id="train-toggle-btn" onclick="toggleRepetitionStatus()">
                    <svg class="chess-icon icon-bookmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z"/></svg> Wiederholung
                </button>
                <button class="action-btn secondary" onclick="repeatLater()">Später</button>
                <button class="action-btn secondary danger-text" onclick="stopTraining()">Beenden</button>
            </div>
        </div>
    </div>
</div>

<!-- Bot Game Results Overlay -->
<div class="training-results-overlay" id="bot-results-overlay">
    <div class="results-card">
        <div class="results-header">
            <div class="results-icon" id="bot-results-icon">
                <svg class="chess-icon icon-trophy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3h8v7c0 6-8 6-8 0ZM8 5H3v4c0 4 5 4 5 4M16 5h5v4c0 4-5 4-5 4M12 14v6M7 21h10"/></svg>
            </div>
            <h2 class="results-title" id="bot-results-title">Spiel beendet!</h2>
            <p class="results-subtitle" id="bot-results-subtitle">Gut gespielt!</p>
        </div>

        <div class="results-stats">
            <div class="stat-box">
                <div class="stat-label">Deine Genauigkeit</div>
                <div class="stat-value primary-color" id="player-accuracy">0%</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Bot Genauigkeit</div>
                <div class="stat-value" id="bot-accuracy">0%</div>
            </div>
        </div>

        <div class="results-actions">
            <button class="results-btn primary" onclick="closeBotResults()">
                <svg class="chess-icon icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg> Schließen
            </button>
        </div>
    </div>
</div>

<div class="training-results-overlay" id="training-results-overlay">
    <div class="results-card">
        <div class="results-header">
            <div class="results-icon" id="results-icon">
                <svg class="chess-icon icon-trophy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3h8v7c0 6-8 6-8 0ZM8 5H3v4c0 4 5 4 5 4M16 5h5v4c0 4-5 4-5 4M12 14v6M7 21h10"/></svg>
            </div>
            <h2 class="results-title" id="results-title">Training abgeschlossen!</h2>
            <p class="results-subtitle" id="results-subtitle">Großartige Leistung!</p>
        </div>

        <div class="results-stats">
            <div class="stat-box">
                <div class="stat-value success-color" id="stat-correct">0</div>
                <div class="stat-label">Richtig</div>
            </div>
            <div class="stat-box">
                <div class="stat-value danger-color" id="stat-wrong">0</div>
                <div class="stat-label">Falsch</div>
            </div>
            <div class="stat-box">
                <div class="stat-value primary-color" id="stat-accuracy">0%</div>
                <div class="stat-label">Genauigkeit</div>
            </div>
        </div>

        <div id="wrong-lines-container"></div>

        <div class="results-actions" id="results-actions">
            <button class="results-btn secondary" onclick="closeTrainingResults()">
                <svg class="chess-icon icon-times" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg> Schließen
            </button>
        </div>
    </div>
</div>

<!-- Context Menu for Moves -->
<div id="move-context-menu" class="context-menu hidden">
    <div class="context-menu-item" id="ctx-delete-move" onclick="executeDeleteMove()">
        <svg class="chess-icon icon-trash" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/></svg> Zug löschen
    </div>
    <div class="context-menu-item" id="ctx-add-annotation" onclick="executeAddAnnotation()">
        <svg class="chess-icon icon-highlighter" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 14 9-11 7 6-10 10ZM4 16l5 4M2 22h10"/></svg> Annotation hinzufügen
    </div>
    <div class="context-submenu hidden" id="annotation-submenu">
        <div class="context-menu-item" onclick="pickAnnotation('??')">??</div>
        <div class="context-menu-item" onclick="pickAnnotation('?')">?</div>
        <div class="context-menu-item" onclick="pickAnnotation('?!')">?!</div>
        <div class="context-menu-item" onclick="pickAnnotation('∓')">∓</div>
        <div class="context-menu-item" onclick="pickAnnotation('±')">±</div>
        <div class="context-menu-item" onclick="pickAnnotation('⩲')">⩲</div>
        <div class="context-menu-item" onclick="pickAnnotation('⩱')">⩱</div>
        <div class="context-menu-item" onclick="pickAnnotation('−+')">−+</div>
        <div class="context-menu-item" onclick="pickAnnotation('+−')">+−</div>
        <div class="context-menu-item" onclick="pickAnnotation('=')">=
        </div>
    </div>
</div>

`,Zg=`// --- CHESS BOARD MODULE ---
// This file contains all chess board related functionality

let board = null;
let game = new Chess();
let currentSide = 'white';

// --- DRAG HANDLER STATE ---
let dragSourceSquare = null;
let lastHoverSquare = null;

// --- ARROW DRAWING STATE ---
const boardWrapper = document.getElementById('board-wrapper');
const svgOverlay = document.getElementById('arrow-overlay');
// Detect touch devices (phone/tablet)
const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
let isDrawing = false;
let startSquare = null;

// --- MOBILE ARROW DRAWING MODE ---
let arrowDrawModeActive = false;
let arrowDrawFirstSquare = null;
let arrowDrawColor = 'green';

// --- MOBILE CIRCLE DRAWING MODE ---
let circleDrawModeActive = false;
let circleDrawColor = 'green';

function toggleArrowDrawMode() {
    // Turn off circle mode if active
    if (circleDrawModeActive) {
        circleDrawModeActive = false;
        document.getElementById('btn-circle-draw')?.classList.remove('active');
        document.getElementById('circle-color-popup')?.classList.add('hidden');
    }

    arrowDrawModeActive = !arrowDrawModeActive;
    const btn = document.getElementById('btn-arrow-draw');
    const colorPopup = document.getElementById('arrow-color-popup');

    if (arrowDrawModeActive) {
        btn.classList.add('active');
        if (colorPopup) colorPopup.classList.remove('hidden');
        arrowDrawFirstSquare = null;
        // Disable piece dragging
        if (board) {
            board.draggable = false;
        }
    } else {
        btn.classList.remove('active');
        if (colorPopup) colorPopup.classList.add('hidden');
        arrowDrawFirstSquare = null;
        clearArrowDrawHighlight();
        // Re-enable piece dragging
        if (board) {
            board.draggable = true;
        }
    }
}

function toggleCircleDrawMode() {
    // Turn off arrow mode if active
    if (arrowDrawModeActive) {
        arrowDrawModeActive = false;
        arrowDrawFirstSquare = null;
        clearArrowDrawHighlight();
        document.getElementById('btn-arrow-draw')?.classList.remove('active');
        document.getElementById('arrow-color-popup')?.classList.add('hidden');
    }

    circleDrawModeActive = !circleDrawModeActive;
    const btn = document.getElementById('btn-circle-draw');
    const colorPopup = document.getElementById('circle-color-popup');

    if (circleDrawModeActive) {
        btn.classList.add('active');
        if (colorPopup) colorPopup.classList.remove('hidden');
        // Disable piece dragging
        if (board) {
            board.draggable = false;
        }
    } else {
        btn.classList.remove('active');
        if (colorPopup) colorPopup.classList.add('hidden');
        // Re-enable piece dragging
        if (board) {
            board.draggable = true;
        }
    }
}

function setArrowColor(color) {
    arrowDrawColor = color;
    document.querySelectorAll('#arrow-color-popup .arrow-color-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === color);
    });
}

function setCircleColor(color) {
    circleDrawColor = color;
    document.querySelectorAll('#circle-color-popup .arrow-color-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === color);
    });
}

function clearArrowDrawHighlight() {
    document.querySelectorAll('.arrow-draw-start').forEach(el => el.classList.remove('arrow-draw-start'));
}

function handleArrowDrawClick(e) {
    if (mode !== 'add') return;
    if (!arrowDrawModeActive && !circleDrawModeActive) return;

    // Get coordinates from touch or mouse event
    let clientX, clientY;
    if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const square = getSquareFromCoords(clientX, clientY);

    if (!square) return;

    e.preventDefault();
    e.stopPropagation();

    // Circle drawing mode - single tap draws a circle
    if (circleDrawModeActive) {
        addShape(square, square, circleDrawColor);
        return;
    }

    // Arrow drawing mode - two taps
    if (arrowDrawModeActive) {
        if (!arrowDrawFirstSquare) {
            // First square selected
            arrowDrawFirstSquare = square;
            clearArrowDrawHighlight();
            const squareEl = document.querySelector(\`#board .square-\${square}\`);
            if (squareEl) squareEl.classList.add('arrow-draw-start');
        } else {
            // Second square selected - draw arrow
            if (arrowDrawFirstSquare !== square) {
                addShape(arrowDrawFirstSquare, square, arrowDrawColor);
            }
            arrowDrawFirstSquare = null;
            clearArrowDrawHighlight();
        }
    }
}

// Add click/touch listeners for arrow drawing mode
boardWrapper.addEventListener('click', (e) => {
    if ((arrowDrawModeActive || circleDrawModeActive) && mode === 'add') {
        handleArrowDrawClick(e);
    }
}, true);

boardWrapper.addEventListener('touchend', (e) => {
    if ((arrowDrawModeActive || circleDrawModeActive) && mode === 'add') {
        // Use the last touch position
        if (e.changedTouches && e.changedTouches[0]) {
            handleArrowDrawClick({
                clientX: e.changedTouches[0].clientX,
                clientY: e.changedTouches[0].clientY,
                preventDefault: () => e.preventDefault(),
                stopPropagation: () => e.stopPropagation()
            });
        }
    }
}, { passive: false });

// --- MOVE HIGHLIGHTING ---
function highlightLastMove(move) {
    if(!userSettings.highlight) return;
    $('#board .square-55d63').removeClass('highlight-square');
    if(move) { $('#board .square-' + move.from).addClass('highlight-square'); $('#board .square-' + move.to).addClass('highlight-square'); }
}

// FORCE IMMEDIATE VISUAL UPDATE FOR POSITION CHANGES
function updateBoardDisplay(fen) {
    board.position(fen, false); // false = no animation
}

// --- PIECE THEME URL ---
function pieceThemeUrl(piece) {
    const style = userSettings.pieceStyle || 'wikipedia';
    const base = 'vendor/pieces/';

    if (style === 'blindfold') return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    if (style === 'wikipedia') return base + 'cburnett/' + piece + '.svg';
    if (style === 'alpha') return base + 'alpha/' + piece + '.svg';
    if (style === 'uscf') return base + 'california/' + piece + '.svg';
    if (style === 'merida') return base + 'merida/' + piece + '.svg';
    if (style === 'maestro') return base + 'maestro/' + piece + '.svg';
    if (style === 'leipzig') return base + 'leipzig/' + piece + '.svg';
    if (style === 'tatiana') return base + 'tatiana/' + piece + '.svg';
    if (style === 'cardinal') return base + 'cardinal/' + piece + '.svg';

    return base + 'cburnett/' + piece + '.svg';
}

// --- SQUARE COORDINATE UTILITIES ---
function getSquareFromPoint(x, y) {
    const boardEl = document.getElementById('board');
    if (!boardEl) return null;
    const rect = boardEl.getBoundingClientRect();
    const squareSize = rect.width / 8;
    const relX = x - rect.left;
    const relY = y - rect.top;
    if (relX < 0 || relX >= rect.width || relY < 0 || relY >= rect.height) return null;
    let col = Math.floor(relX / squareSize);
    let row = Math.floor(relY / squareSize);
    // Adjust for board orientation
    const isFlipped = currentSide === 'black';
    if (isFlipped) {
        col = 7 - col;
        row = 7 - row;
    }
    const files = 'abcdefgh';
    const ranks = '87654321';
    return files[col] + ranks[row];
}

function getSquareFromCoords(clientX, clientY) {
    const rect = boardWrapper.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const squareSize = rect.width / 8;

    let col = Math.floor(x / squareSize);
    let row = Math.floor(y / squareSize);

    if(currentSide === 'black') {
        col = 7 - col;
        row = 7 - row;
    }

    const files = ['a','b','c','d','e','f','g','h'];
    const ranks = ['8','7','6','5','4','3','2','1'];

    if(col >= 0 && col <= 7 && row >= 0 && row <= 7) {
        return files[col] + ranks[row];
    }
    return null;
}

function getSquareCenter(sq) {
    const boardEl = document.getElementById('board');
    const boardRect = boardEl.getBoundingClientRect();
    const boardWrapperRect = boardWrapper.getBoundingClientRect();
    const size = boardRect.width / 8;
    const files = ['a','b','c','d','e','f','g','h'];
    const ranks = ['8','7','6','5','4','3','2','1'];

    let col = files.indexOf(sq.charAt(0));
    let row = ranks.indexOf(sq.charAt(1));

    if(currentSide === 'black') {
        col = 7 - col;
        row = 7 - row;
    }

    // Calculate position relative to boardWrapper (SVG coordinate system)
    const offsetX = boardRect.left - boardWrapperRect.left;
    const offsetY = boardRect.top - boardWrapperRect.top;

    return {
        x: col * size + size / 2 + offsetX,
        y: row * size + size / 2 + offsetY
    };
}

function getCleanFen() { return game.fen().split(' ').slice(0, 4).join(' '); }

// --- DRAG HANDLERS ---
function onDragMove(e) {
    if (!dragSourceSquare) return;
    const x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);
    if (x === undefined || y === undefined) return;
    const square = getSquareFromPoint(x, y);
    if (square !== lastHoverSquare) {
        if (lastHoverSquare) {
            $(\`#board .square-\${lastHoverSquare}\`).removeClass('drag-hover');
        }
        if (square && square !== dragSourceSquare) {
            $(\`#board .square-\${square}\`).addClass('drag-hover');
        }
        lastHoverSquare = square;
    }
}

function onDragStart (source, piece) {
    // Block dragging if arrow draw mode is active
    if (arrowDrawModeActive) return false;

    // Generelle Checks
    if (isPaused) return false;
    if (game.game_over()) return false;
    if (isBotThinking) return false; // LOCK BOARD IF BOT IS THINKING

    // Regel 1: Man darf immer nur die Farbe ziehen, die gerade am Zug ist
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }

    // Regel 2: Im TRAINING und BOT Modus darf man NIEMALS die gegnerischen Figuren anfassen.
    if (mode === 'train' || mode === 'bot') {
        if ((currentSide === 'white' && piece.search(/^b/) !== -1) ||
            (currentSide === 'black' && piece.search(/^w/) !== -1)) {
            return false;
        }
    }

    // Highlight the source square and mark board as dragging
    dragSourceSquare = source;
    lastHoverSquare = null;
    $('#board').addClass('is-dragging');
    $(\`#board .square-\${source}\`).addClass('drag-source');

    // Add mouse/touch move listeners for hover tracking
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('touchmove', onDragMove);

    setTimeout(() => {
        const draggedPieces = document.querySelectorAll('img[src*="piece"]');
        draggedPieces.forEach(el => {
            el.style.visibility = 'visible !important';
            el.style.opacity = '1 !important';
            el.style.zIndex = '999999';
        });
    }, 0);

    return true;
}

function onMouseoverSquare(square, piece) {
    // Only highlight if we're dragging a piece
    if (dragSourceSquare) {
        $(\`#board .square-\${square}\`).addClass('drag-hover');
    }
}

function onMouseoutSquare(square, piece) {
    $(\`#board .square-\${square}\`).removeClass('drag-hover');
}

function onDrop (source, target) {
    // Clear drag highlights and remove listeners
    $('#board').removeClass('is-dragging');
    $('#board .square-55d63').removeClass('drag-source drag-hover');
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('touchmove', onDragMove);
    dragSourceSquare = null;
    lastHoverSquare = null;

    let moveObj = { from: source, to: target, promotion: 'q' };
    let move = game.move(moveObj);
    if (move === null) return 'snapback';

    if(move.captured) playSound('capture');
    else playSound('move');
    highlightLastMove(move);

    return new Promise((resolve) => {
        setTimeout(() => {
            if (mode === 'add') {
                currentDisplayAnnotations = {}; // Clear annotations when making a new move
                // Update full history and reset preview index to end
                addModeFullHistory = game.history({ verbose: true });
                addModePreviewIndex = addModeFullHistory.length - 1;
                updatePgnDisplay();
                loadNoteForCurrentPos();
                updateOpeningExplorer(); // Update explorer with new position
                updateAnalysisIfActive(); // Update analysis if enabled
            }
            else if (mode === 'train') {
                handleTrainingMove(move);
            }
            else if (mode === 'bot') {
                // Check if game ended after player's move
                if(game.game_over()) {
                    setTimeout(() => {
                        showBotGameResults();
                    }, 500);
                } else {
                    updateBotStatus("Bot denkt nach...", "neutral");
                    isBotThinking = true;
                    setTimeout(makeBotMove, 500);
                }
            }
            else if (mode === 'view') {
                updateViewSearch();
            }
            else if (mode === 'selection') {
                updateSelectionSearch();
            }

            if (isEngineRunning && mode !== 'bot' && mode !== 'train') {
                setTimeout(startEvaluation, 50);
            }
            resolve();
        }, 50);
    });
}

function onSnapEnd () {
    setTimeout(() => {
        board.position(game.fen(), false);
    }, 10);
}

function forceboardUpdate(fen, callback) {
    board.position(fen, false);
    setTimeout(() => {
        if (callback) callback();
    }, 100);
}

// --- BOARD INITIALIZATION ---
function initBoard() {
    const config = {
        draggable: true,
        position: game.fen(),
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        onMouseoverSquare: onMouseoverSquare,
        onMouseoutSquare: onMouseoutSquare,
        pieceTheme: pieceThemeUrl,
        moveSpeed: userSettings.animSpeed,
        snapSpeed: userSettings.animSpeed,
        showNotation: userSettings.coords,
        orientation: currentSide
    };
    if(board) board.destroy(); $('#board').empty(); board = Chessboard('board', config);
    // Ensure touch interactions work on mobile: prevent native touch scrolling inside the board
    const boardEl = document.getElementById('board');
    if (boardEl) {
        boardEl.addEventListener('touchstart', (ev) => { if (window.innerWidth <= 768) ev.preventDefault(); }, { passive: false });
    }
    const history = game.history({verbose:true}); if(history.length > 0) highlightLastMove(history[history.length-1]);
    setTimeout(() => { board.resize(); drawShapes(); }, 100);
}

// --- ARROW/SHAPE DRAWING ---
function getColorCode(c) {
    if(c === 'green') return '#22c55e';
    if(c === 'red') return '#ef4444';
    if(c === 'blue') return '#3b82f6';
    if(c === 'yellow') return '#eab308';
    return '#22c55e';
}

function drawArrow(from, to, color) {
    const start = getSquareCenter(from);
    const end = getSquareCenter(to);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", start.x);
    line.setAttribute("y1", start.y);
    line.setAttribute("x2", end.x);
    line.setAttribute("y2", end.y);
    line.setAttribute("stroke", getColorCode(color));
    line.setAttribute("stroke-width", "5");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("stroke-linejoin", "round");
    line.setAttribute("opacity", "0.8");
    line.setAttribute("marker-end", \`url(#arrowhead-\${color})\`);

    svgOverlay.appendChild(line);
}

function drawCircle(sq, color) {
    const center = getSquareCenter(sq);
    const rect = boardWrapper.getBoundingClientRect();
    const size = rect.width / 8;

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", center.x);
    circle.setAttribute("cy", center.y);
    circle.setAttribute("r", size / 2.2);
    circle.setAttribute("stroke", getColorCode(color));
    circle.setAttribute("stroke-width", "4");
    circle.setAttribute("fill", "none");
    circle.setAttribute("opacity", "0.8");

    svgOverlay.appendChild(circle);
}

function drawAnnotation(sq, annotation) {
    const center = getSquareCenter(sq);
    const boardEl = document.getElementById('board');
    const rect = boardEl.getBoundingClientRect();
    const size = rect.width / 8;

    // Position proportionally to square size for consistent placement on all screen sizes
    const offsetX = size * 0.2; // 20% of square size from right edge
    const offsetY = size * 0.2; // 20% of square size from top edge (moved closer to top)

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", center.x + size / 2 - offsetX);
    text.setAttribute("y", center.y - size / 2 + offsetY);
    text.setAttribute("font-size", Math.max(14, size * 0.25)); // Scale font size with square size, min 14px
    text.setAttribute("font-weight", "bold");
    // Set text color based on annotation
    let textColor = "#000"; // default black
    if (annotation === "??" || annotation === "?" || annotation === "?!" || annotation === "∓" || annotation === "−+") {
        textColor = "#fff"; // white for dark backgrounds
    }
    text.setAttribute("fill", textColor);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle"); // Center vertically
    text.textContent = annotation;

    // Add background circle for visibility with color based on annotation
    let bgColor = "rgba(255,255,255,0.8)"; // default white
    if (annotation === "??") bgColor = "rgba(239, 68, 68, 0.9)"; // red for blunder
    else if (annotation === "?") bgColor = "rgba(249, 115, 22, 0.9)"; // orange for mistake
    else if (annotation === "?!") bgColor = "rgba(234, 179, 8, 0.9)"; // yellow for dubious
    else if (annotation === "∓") bgColor = "rgba(0,0,0,0.8)"; // black for black much better
    else if (annotation === "±") bgColor = "rgba(255,255,255,0.9)"; // white for white much better
    else if (annotation === "−+") bgColor = "rgba(0,0,0,0.8)"; // black for black slightly better
    else if (annotation === "+−") bgColor = "rgba(255,255,255,0.9)"; // white for white slightly better
    else if (annotation === "=") bgColor = "rgba(255,255,255,0.9)"; // white for equal

    const bg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    bg.setAttribute("cx", center.x + size / 2 - offsetX);
    bg.setAttribute("cy", center.y - size / 2 + offsetY);
    bg.setAttribute("r", Math.max(10, size * 0.2)); // Scale circle size with square size, min 10px
    bg.setAttribute("fill", bgColor);

    // Add black border for white circles
    if (bgColor.includes("255,255,255")) {
        bg.setAttribute("stroke", "#000");
        bg.setAttribute("stroke-width", "1");
    }

    svgOverlay.appendChild(bg);
    svgOverlay.appendChild(text);
}

function drawShapes() {
    const fen = getCleanFen();
    const shapes = currentShapes[fen] || [];
    svgOverlay.innerHTML = '';

    // Define smooth arrow markers
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    ['green', 'red', 'blue', 'yellow'].forEach(c => {
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", \`arrowhead-\${c}\`);
        marker.setAttribute("markerWidth", "5");
        marker.setAttribute("markerHeight", "5");
        marker.setAttribute("refX", "2.5");
        marker.setAttribute("refY", "2.5");
        marker.setAttribute("orient", "auto");

        // Use path for smoother curves
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M 0 0.5 Q 1 2.5 0 4.5 L 5 2.5 Z"); // Curved arrowhead
        path.setAttribute("fill", getColorCode(c));

        marker.appendChild(path);
        defs.appendChild(marker);
    });
    svgOverlay.appendChild(defs);

    shapes.forEach(shape => {
        if(shape.from === shape.to) {
            drawCircle(shape.from, shape.color);
        } else {
            drawArrow(shape.from, shape.to, shape.color);
        }
    });

    // Draw annotations based on mode
    let annotationsToDraw = {};
    if (mode === 'train') {
        annotationsToDraw = currentTrainingAnnotations;
    } else if (mode === 'add') {
        annotationsToDraw = currentDisplayAnnotations;
    }

    Object.keys(annotationsToDraw).forEach(sq => {
        drawAnnotation(sq, annotationsToDraw[sq]);
    });
}

function addShape(from, to, color) {
    const fen = getCleanFen();
    if(!currentShapes[fen]) currentShapes[fen] = [];

    const existingIdx = currentShapes[fen].findIndex(s => s.from === from && s.to === to);

    if (existingIdx !== -1) {
        currentShapes[fen].splice(existingIdx, 1);
    } else {
        currentShapes[fen].push({ from, to, color });
    }
    drawShapes();
}

function clearShapesForCurrentPos() {
    const fen = getCleanFen();
    delete currentShapes[fen];
    drawShapes();
}

// --- ARROW DRAWING EVENT LISTENERS ---
// UPDATED: Use Capture phase to ensure right-click works on all squares including pieces
boardWrapper.addEventListener('mousedown', (e) => {
    // Disable drawing on touch devices (phones/tablets)
    if (isTouchDevice) return;
    if(e.button === 2) { // Right Click
        isDrawing = true;
        startSquare = getSquareFromCoords(e.clientX, e.clientY);
        e.preventDefault(); // Prevent any default behavior on right-click
        e.stopPropagation(); // Stop event from reaching piece handlers
    }
}, true); // Use capture phase

// Add this to prevent default context menu on the board
boardWrapper.addEventListener('contextmenu', (e) => { e.preventDefault(); return false; }, true);

boardWrapper.addEventListener('mouseup', (e) => {
    if (isTouchDevice) return;
    if(isDrawing && e.button === 2) {
        const endSquare = getSquareFromCoords(e.clientX, e.clientY);
        if(startSquare && endSquare) {
            let color = 'green';
            if(e.shiftKey) color = 'red';
            else if(e.altKey) color = 'blue';
            else if(e.ctrlKey) color = 'yellow';

            addShape(startSquare, endSquare, color);
        }
        isDrawing = false;
        startSquare = null;
        e.preventDefault();
        e.stopPropagation();
    }
}, true); // Use capture phase

// If on touch device, hide the clear-shapes buttons (all) because drawing is disabled
if (isTouchDevice) {
    document.querySelectorAll('.clear-shapes-btn').forEach(btn => btn.classList.add('hidden'));
}

// --- RESIZE HANDLER ---
window.addEventListener('resize', () => {
    board.resize();
    setTimeout(drawShapes, 50);
});
`,Qg=`// --- RESIZER LOGIC ---
const resizer = document.getElementById('resizer');
const boardArea = document.getElementById('board-area');
const container = document.getElementById('main-container');
let isResizing = false;
resizer.addEventListener('mousedown', (e) => { isResizing = true; document.body.style.cursor = 'col-resize'; resizer.classList.add('dragging'); e.preventDefault(); });
document.addEventListener('mousemove', (e) => { if (!isResizing) return; const containerWidth = container.getBoundingClientRect().width; let newFlex = (e.clientX / containerWidth) * 100; if(newFlex < 30) newFlex = 30; if(newFlex > 70) newFlex = 70; boardArea.style.flex = \`0 0 \${newFlex}%\`; if(board) board.resize(); });
document.addEventListener('mouseup', () => { if(isResizing) { isResizing = false; document.body.style.cursor = ''; resizer.classList.remove('dragging'); if(board) board.resize(); } });

// --- AUDIO ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
function initAudio() { if (audioCtx.state === 'suspended') { audioCtx.resume(); } }

function playSound(type) {
    if(!userSettings.sound) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const gainNode = audioCtx.createGain(); osc.connect(gainNode); gainNode.connect(audioCtx.destination);
    if (type === 'move') { osc.type = 'sine'; osc.frequency.setValueAtTime(300, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.05); gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05); osc.start(); osc.stop(audioCtx.currentTime + 0.05); }
    else if (type === 'capture') {
        // Deep capture: use move's base frequency as starting point, ramp down for weight
        const baseStart = 300; // match move base
        const baseEnd = 40;    // deep final frequency

        // Main thud (uses move-like start frequency, ramps down)
        const thudFilter = audioCtx.createBiquadFilter();
        thudFilter.type = 'lowpass';
        thudFilter.frequency.setValueAtTime(240, audioCtx.currentTime);

        const thud = audioCtx.createOscillator();
        const thudGain = audioCtx.createGain();
        thud.type = 'sine';
        thud.frequency.setValueAtTime(baseStart, audioCtx.currentTime);
        thud.frequency.exponentialRampToValueAtTime(baseEnd, audioCtx.currentTime + 0.18);
        thudGain.gain.setValueAtTime(0.7, audioCtx.currentTime);
        thudGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);
        thud.connect(thudFilter); thudFilter.connect(thudGain); thudGain.connect(audioCtx.destination);
        thud.start(); thud.stop(audioCtx.currentTime + 0.7);

        // Sub oscillator for depth
        const sub = audioCtx.createOscillator();
        const subGain = audioCtx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(30, audioCtx.currentTime);
        subGain.gain.setValueAtTime(0.22, audioCtx.currentTime);
        subGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.9);
        sub.connect(subGain); subGain.connect(audioCtx.destination);
        sub.start(); sub.stop(audioCtx.currentTime + 0.9);

        // Soft bell accent (low volume)
        const bell = audioCtx.createOscillator();
        const bellGain = audioCtx.createGain();
        bell.type = 'triangle';
        bell.frequency.setValueAtTime(800, audioCtx.currentTime);
        bell.frequency.exponentialRampToValueAtTime(380, audioCtx.currentTime + 0.06);
        bellGain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        bellGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
        bell.connect(bellGain); bellGain.connect(audioCtx.destination);
        bell.start(); bell.stop(audioCtx.currentTime + 0.18);

        // Subtle click to emphasize impact
        const clickBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.02, audioCtx.sampleRate);
        const data = clickBuf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.005));
        const click = audioCtx.createBufferSource();
        const clickGain = audioCtx.createGain();
        click.buffer = clickBuf; click.connect(clickGain); clickGain.connect(audioCtx.destination);
        clickGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        click.start(); click.stop(audioCtx.currentTime + 0.02);
    }
    else if (type === 'error') { osc.type = 'sine'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.2); gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2); osc.start(); osc.stop(audioCtx.currentTime + 0.2); }
}

let userSettings = JSON.parse(localStorage.getItem('chessSettingsPro')) || { theme: 'dark', sound: true, coords: true, highlight: true, autoRepeat: false, animSpeed: 150, boardColor: 'green', pieceStyle: 'wikipedia', sortMode: 'similarity', treeView: false, editorOrder: ['name', 'stockfish', 'database', 'moves'], analysisOpen: false, databaseOpen: true, roundedCorners: false };

// Line statistics tracking
let lineStats = JSON.parse(localStorage.getItem('chessLineStats')) || {};

// Safety Reset for old bad settings
if(userSettings.pieceStyle === 'dubrovnik') { userSettings.pieceStyle = 'wikipedia'; localStorage.setItem('chessSettingsPro', JSON.stringify(userSettings)); }
// Migration: Convert old createModeOrder to new editorOrder array
const defaultOrder = ['name', 'stockfish', 'database', 'moves'];
if(!userSettings.editorOrder || !Array.isArray(userSettings.editorOrder)) {
    // Convert old format to new
    if(userSettings.createModeOrder === 'database-first') {
        userSettings.editorOrder = ['name', 'database', 'stockfish', 'moves'];
    } else {
        userSettings.editorOrder = defaultOrder;
    }
    delete userSettings.createModeOrder;
    localStorage.setItem('chessSettingsPro', JSON.stringify(userSettings));
}
// Migration: Remove 'notes' from editorOrder if present
if(userSettings.editorOrder && userSettings.editorOrder.includes('notes')) {
    userSettings.editorOrder = userSettings.editorOrder.filter(k => k !== 'notes');
    localStorage.setItem('chessSettingsPro', JSON.stringify(userSettings));
}

let expandedCategories = {};
let isPaused = false;
let pendingNextAction = null;
let totalTrainingLines = 0;
const REPETITION_CAT = "Wiederholung";
let trainingStats = {
correct: 0,
wrong: 0,
wrongLines: []
};

function updateSettingsUI() {
    document.getElementById('setting-theme-row').classList.toggle('active', userSettings.theme === 'dark');
    document.getElementById('setting-sound-row').classList.toggle('active', userSettings.sound);
    document.getElementById('setting-coords-row').classList.toggle('active', userSettings.coords);
    document.getElementById('setting-highlight-row').classList.toggle('active', userSettings.highlight);
    document.getElementById('setting-autorepeat-row').classList.toggle('active', userSettings.autoRepeat);
    document.getElementById('setting-treeview-row').classList.toggle('active', userSettings.treeView); //Tree
    document.getElementById('setting-rounded-row').classList.toggle('active', userSettings.roundedCorners);

    // Stockfish Toggle
    const engineRow = document.getElementById('setting-engine-row');
    if(engineRow) engineRow.classList.toggle('active', isEngineRunning);

    // Sort Mode Toggle
    const sortRow = document.getElementById('setting-sortmode-row');
    if(sortRow) sortRow.classList.toggle('active', userSettings.sortMode === 'mastery');

    document.querySelectorAll('.option-card').forEach(el => el.classList.remove('selected'));
    if(document.getElementById(\`opt-anim-\${userSettings.animSpeed}\`)) document.getElementById(\`opt-anim-\${userSettings.animSpeed}\`).classList.add('selected');
    if(document.getElementById(\`opt-board-\${userSettings.boardColor}\`)) document.getElementById(\`opt-board-\${userSettings.boardColor}\`).classList.add('selected');
    if(document.getElementById(\`opt-piece-\${userSettings.pieceStyle}\`)) document.getElementById(\`opt-piece-\${userSettings.pieceStyle}\`).classList.add('selected');

    // Render editor order list
    renderEditorOrderList();
}
function applySettings() {
    if (userSettings.theme === 'light') document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode');
    document.getElementById('board').className = \`board-theme-\${userSettings.boardColor}\`;
    if (userSettings.roundedCorners) document.getElementById('board').classList.add('board-rounded'); else document.getElementById('board').classList.remove('board-rounded');
    if(board) initBoard();
    updateSettingsUI();
}
function toggleSetting(key) {
    userSettings[key] = !userSettings[key];
    saveSettings();
    applySettings();

    // Re-render list immediately when treeView is toggled
    if (key === 'treeView') {
        if (mode === 'view') renderList();
        else if (mode === 'selection') renderSelectionList();
    }
}
function toggleThemeSetting() { window.parent.postMessage({type: 'erudite-chess-theme'}, '*'); }
function toggleSortMode() {
    userSettings.sortMode = userSettings.sortMode === 'similarity' ? 'mastery' : 'similarity';
    saveSettings();
    applySettings();
    if (mode === 'view') renderList(); // Refresh the list immediately
}
function setAnimSpeed(speed) { userSettings.animSpeed = speed; saveSettings(); applySettings(); }
function setBoardColor(c) { userSettings.boardColor = c; saveSettings(); applySettings(); }
function setPieceTheme(s) { userSettings.pieceStyle = s; saveSettings(); applySettings(); }

// Move an item in the editor order list up or down
function moveOrderItem(key, direction) {
    const order = userSettings.editorOrder;
    const index = order.indexOf(key);
    if (index === -1) return;

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= order.length) return;

    // Swap elements
    [order[index], order[newIndex]] = [order[newIndex], order[index]];
    saveSettings();
    renderEditorOrderList();
}

// Render the order list in settings UI
function renderEditorOrderList() {
    const container = document.getElementById('editor-order-list');
    if (!container) return;

    const labels = {
        'name': 'Kategorie',
        'stockfish': 'Stockfish Analyse',
        'database': 'Datenbank',
        'moves': 'Züge'
    };

    container.innerHTML = userSettings.editorOrder.map(key => \`
        <div class="order-item" data-key="\${key}">
            <svg class="chess-icon icon-grip-lines" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>
            <span>\${labels[key]}</span>
            <div class="order-arrows">
                <button onclick="moveOrderItem('\${key}', -1)"><svg class="chess-icon icon-chevron-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg></button>
                <button onclick="moveOrderItem('\${key}', 1)"><svg class="chess-icon icon-chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>
            </div>
        </div>
    \`).join('');
}

// Apply the user's preferred order to the add-mode UI
function applyCreateModeOrder() {
    const container = document.getElementById('add-mode-sections');
    const buttonsContainer = document.querySelector('.add-mode-buttons');
    if (!container) return;

    const order = userSettings.editorOrder;

    // Reorder sections based on user preference
    order.forEach(key => {
        const element = container.querySelector(\`[data-element="\${key}"]\`);
        if (element) {
            container.appendChild(element);
        }
    });

    // Reorder buttons based on stockfish/database order
    if (buttonsContainer) {
        const stockfishIndex = order.indexOf('stockfish');
        const databaseIndex = order.indexOf('database');
        const btnAnalysis = document.getElementById('btn-analysis');
        const btnDatabase = document.getElementById('btn-database');

        if (btnAnalysis && btnDatabase) {
            if (databaseIndex < stockfishIndex) {
                buttonsContainer.insertBefore(btnDatabase, btnAnalysis);
            } else {
                buttonsContainer.insertBefore(btnAnalysis, btnDatabase);
            }
        }
    }
}
function saveSettings() { localStorage.setItem('chessSettingsPro', JSON.stringify(userSettings)); }
function openSettings() { switchUI('settings-mode'); updateSettingsUI(); }
function closeSettings() { switchUI('view-mode'); }

// Board variables are now in board.js (board, game, currentSide)

let mode = 'view'; let editingId = null; let repertoire = JSON.parse(localStorage.getItem('chessRepertoire_v3')) || { white: [], black: [] };
let currentComments = {};
let currentShapes = {};
let currentAnnotations = {};
let currentDisplayAnnotations = {};
let currentTrainingAnnotations = {};
let trainingQueue = []; let currentTrainLine = null; let currentMoveIndex = 0;
let addModePreviewIndex = -1; // -1 means at the end (current position)
let addModeFullHistory = []; // Store full history to enable forward navigation after going back

// Board functions (onDrop, onSnapEnd, forceboardUpdate, etc.) are now in board.js

function updateViewSearch() { const currentPgn = game.pgn(); if (!currentPgn) { resetBoardSearch(); return; } document.getElementById('search-active-banner').classList.remove('hidden'); renderList(currentPgn); }

function updateSelectionSearch() {
    const currentPgn = game.pgn();
    if (!currentPgn) {
        resetSelectionBoardSearch();
        return;
    }
    document.getElementById('selection-search-banner')?.classList.remove('hidden');
    renderSelectionList(currentPgn);
}

function resetSelectionBoardSearch() {
    game.reset();
    board.position(game.fen());
    $('#board .square-55d63').removeClass('highlight-square');
    document.getElementById('selection-search-banner')?.classList.add('hidden');
    renderSelectionList();
}

function resetBoardSearch() {
    game.reset(); board.position(game.fen()); $('#board .square-55d63').removeClass('highlight-square'); document.getElementById('search-active-banner').classList.add('hidden'); renderList(null);
    if(isEngineRunning && engine) engine.postMessage('stop');
    document.getElementById('eval-fill').style.height = '50%';
    document.getElementById('eval-score').innerText = '0.0';
    currentTrainingAnnotations = {}; // Clear training annotations
    currentDisplayAnnotations = {}; // Clear display annotations
    drawShapes();
}

// Toggle eval bar on home screen
let evalBarActive = false;

async function toggleEvalBar() {
    evalBarActive = !evalBarActive;
    const btn = document.getElementById('btn-eval-bar');
    const evalBar = document.getElementById('eval-bar-container');

    if (evalBarActive) {
        btn.classList.add('active');
        evalBar.classList.remove('hidden');
        isEngineRunning = true;
        startEvaluation();
    } else {
        btn.classList.remove('active');
        evalBar.classList.add('hidden');
        isEngineRunning = false;
        await stopEngineCalculation();
        // Reset eval bar
        document.getElementById('eval-fill').style.height = '50%';
        document.getElementById('eval-score').innerText = '0.0';
    }
}

function getGroupedLines(side, filterPgn = null) { const groups = {}; repertoire[side].forEach(line => { if (filterPgn && !line.pgn.startsWith(filterPgn)) return; const cat = line.category || 'Allgemein'; if (!groups[cat]) groups[cat] = []; groups[cat].push(line); }); return groups; }
function setSide(color) { currentSide = color; $('.color-btn').removeClass('active'); $(\`.color-btn:contains('\${color === 'white' ? 'Weiß' : 'Schwarz'}')\`).addClass('active'); board.orientation(color); resetBoardSearch(); }

// Mobile board toggle
let mobileBoardVisible = false;
function toggleMobileBoard() {
    mobileBoardVisible = !mobileBoardVisible;
    const boardArea = document.getElementById('board-area');
    const toggleBtn = document.getElementById('mobile-board-toggle');

    if (mobileBoardVisible) {
        boardArea.classList.add('mobile-visible');
        toggleBtn.classList.add('active');
        toggleBtn.title = 'Brett schließen';
        // Resize board after it becomes visible
        setTimeout(() => {
            if (board) board.resize();
        }, 50);
    } else {
        boardArea.classList.remove('mobile-visible');
        toggleBtn.classList.remove('active');
        toggleBtn.title = 'Brett anzeigen';
    }
}

function toggleCategory(catEscaped) {
    if (expandedCategories[catEscaped]) delete expandedCategories[catEscaped];
    else expandedCategories[catEscaped] = true;
    renderList(game.pgn());
}

function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(repertoire));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "chess_repertoire_" + new Date().toISOString().slice(0,10) + ".json");
    document.body.appendChild(downloadAnchorNode); downloadAnchorNode.click(); downloadAnchorNode.remove();
}
function importData(input) {
    const file = input.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const newRepertoire = JSON.parse(e.target.result);
            if (newRepertoire.white && newRepertoire.black) {
                if(confirm("Warnung: Deine aktuellen Daten werden überschrieben. Fortfahren?")) { repertoire = newRepertoire; saveData(); renderList(); alert("Daten erfolgreich geladen!"); }
            } else { alert("Ungültige Datei."); }
        } catch (err) { alert("Fehler beim Lesen der Datei."); }
    };
    reader.readAsText(file);
}

// --- REPETITION LOGIC ---
function updateRepetitionButtonState() {
    const btnFooter = document.getElementById('train-toggle-btn');
    if (!currentTrainLine || !btnFooter) return;

    const exists = repertoire[currentSide].some(l => l.pgn === currentTrainLine.pgn && l.category === REPETITION_CAT);

    if (exists) {
        btnFooter.innerHTML = '<svg class="chess-icon icon-check-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 12 3 3 7-7M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"/></svg> Gemeistert (Entfernen)';
        btnFooter.className = 'action-btn remove-repetition';
    } else {
        btnFooter.innerHTML = '<svg class="chess-icon icon-bookmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z"/></svg> Wiederholung';
        btnFooter.className = 'action-btn repetition';
    }
}

function toggleRepetitionStatus() {
    const exists = repertoire[currentSide].some(l => l.pgn === currentTrainLine.pgn && l.category === REPETITION_CAT);

    if (exists) {
        repertoire[currentSide] = repertoire[currentSide].filter(l => !(l.pgn === currentTrainLine.pgn && l.category === REPETITION_CAT));
        saveData();
        updateRepetitionButtonState();
    } else {
        const newLine = JSON.parse(JSON.stringify(currentTrainLine));
        newLine.id = Date.now();
        // Preserve original category name for repetition entries
        newLine.originalCategory = currentTrainLine.originalCategory || currentTrainLine.category;
        newLine.category = REPETITION_CAT;
        repertoire[currentSide].unshift(newLine);
        saveData();
        updateRepetitionButtonState();
    }
}

function toggleRepetitionFromList(id) {
    const line = repertoire[currentSide].find(l => l.id === id);
    if (!line) return;
    const repIndex = repertoire[currentSide].findIndex(l => l.pgn === line.pgn && l.category === REPETITION_CAT);
    if (repIndex !== -1) { repertoire[currentSide].splice(repIndex, 1); }
    else { const newLine = JSON.parse(JSON.stringify(line)); newLine.id = Date.now(); newLine.originalCategory = line.category; newLine.category = REPETITION_CAT; repertoire[currentSide].unshift(newLine); }
    saveData(); renderList(game.pgn());
}

function addToRepetition(line) {
    const alreadyExists = repertoire[currentSide].some(l => l.pgn === line.pgn && l.category === REPETITION_CAT);
    if (!alreadyExists) {
        const newLine = JSON.parse(JSON.stringify(line)); newLine.id = Date.now(); newLine.originalCategory = line.category; newLine.category = REPETITION_CAT;
        repertoire[currentSide].unshift(newLine); saveData();
        updateRepetitionButtonState();
    }
}

function renderList(filterPgn = null) {
    const list = document.getElementById('lines-list');
    list.innerHTML = '';
    const groups = getGroupedLines(currentSide, filterPgn);

    const repetitionLines = repertoire[currentSide].filter(l => l.category === REPETITION_CAT);
    const repetitionPgns = new Set(repetitionLines.map(l => l.pgn));

    const categories = Object.keys(groups).sort((a,b) => {
        if(a === REPETITION_CAT) return -1;
        if(b === REPETITION_CAT) return 1;
        return a.localeCompare(b);
    });

    if (categories.length === 0) {
        list.innerHTML = \`<div style="text-align:center; color:var(--text-muted); padding:20px;">Leer.</div>\`;
        return;
    }

    categories.forEach(cat => {
        const catEscaped = cat.replace(/'/g, "\\\\'");
        const isExpanded = expandedCategories[cat];
        const arrowClass = isExpanded ? 'expanded' : '';
        const contentClass = isExpanded ? 'expanded' : '';
        const specialClass = (cat === REPETITION_CAT) ? 'special-cat' : '';

        const groupDiv = document.createElement('div');
        groupDiv.className = 'category-group';

        groupDiv.innerHTML = \`
            <div class="category-header \${arrowClass} \${specialClass}" onclick="toggleCategory('\${catEscaped}')">
                <div style="display:flex; align-items:center;">
                    <svg class="chess-icon icon-chevron-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg><span>\${cat}</span>
                </div>
                <div class="cat-actions" onclick="event.stopPropagation()">
                    <button onclick="startAddingLine('\${catEscaped}')"><svg class="chess-icon icon-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
                    <button onclick="renameCategory('\${catEscaped}')"><svg class="chess-icon icon-pen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5 4 4M4 20l4-1L21 6l-4-4L4 15Z"/></svg></button>
                    <button class="del" onclick="deleteCategory('\${catEscaped}')"><svg class="chess-icon icon-trash" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/></svg></button>
                </div>
            </div>\`;

        const contentDiv = document.createElement('div');
        contentDiv.className = \`category-content \${contentClass}\`;

        // --- TREE VIEW LOGIC ---
        if (userSettings.treeView && groups[cat].length > 0) {
            // Build and render the tree for this category
            const treeHTML = buildCategoryTree(groups[cat], repetitionPgns);
            contentDiv.innerHTML = \`<div class="tree-container">\${treeHTML}</div>\`;
        }
        // --- STANDARD LIST LOGIC ---
        else {
            // Your existing sorting logic
            groups[cat].sort((a, b) => {
                 if (userSettings.sortMode === 'mastery') {
                    const statsA = lineStats[a.id] || { correct: 0, wrong: 0 };
                    const statsB = lineStats[b.id] || { correct: 0, wrong: 0 };
                    const accA = (statsA.correct + statsA.wrong) > 0 ? statsA.correct / (statsA.correct + statsA.wrong) : 0;
                    const accB = (statsB.correct + statsB.wrong) > 0 ? statsB.correct / (statsB.correct + statsB.wrong) : 0;
                    return accA - accB;
                }
                return a.pgn.length - b.pgn.length; // Default simple sort
            });

            groups[cat].forEach(line => {
                const div = document.createElement('div');
                const isInRepetition = cat !== REPETITION_CAT && repetitionPgns.has(line.pgn);
                const repetitionClass = isInRepetition ? 'in-repetition' : '';
                div.className = \`line-item \${repetitionClass}\`;

                // Render individual moves for context menu support
                const movesHtml = renderLineMovesWithContextMenu(line);

                div.innerHTML = \`
                    <span class="line-moves">\${movesHtml}</span>
                    <div class="line-actions">
                        <button onclick="toggleRepetitionFromList(\${line.id})" class="toggle-rep" title="Wiederholung">
                            <svg class="chess-icon icon-bookmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z"/></svg>
                        </button>
                        <button onclick="startBotSetup(\${line.id})" title="Gegen Bot"><svg class="chess-icon icon-robot" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16v14H4ZM12 2v4M8 11h1m6 0h1M8 16h8M1 10v6m22-6v6"/></svg></button>
                        <button onclick="editLine(\${line.id})"><svg class="chess-icon icon-pen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5 4 4M4 20l4-1L21 6l-4-4L4 15Z"/></svg></button>
                        <button class="del" onclick="deleteLine(\${line.id})"><svg class="chess-icon icon-trash" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/></svg></button>
                    </div>\`;
                contentDiv.appendChild(div);
            });
        }

        groupDiv.appendChild(contentDiv);
        list.appendChild(groupDiv);
    });
}

// Render line moves as individual spans with context menu support
function renderLineMovesWithContextMenu(line) {
    const tempGame = new Chess();
    if (!line.pgn) return '<span class="view-move">Startposition</span>';

    tempGame.load_pgn(line.pgn);
    const history = tempGame.history();
    if (history.length === 0) return '<span class="view-move">Startposition</span>';

    let html = '';
    let moveNumber = 1;

    for (let i = 0; i < history.length; i++) {
        if (i % 2 === 0) {
            html += \`<span class="view-move-num">\${moveNumber}.</span>\`;
            moveNumber++;
        }

        // Check if this move has an annotation
        const annotation = line.annotations && line.annotations[i] ? line.annotations[i] : '';
        const annotationHtml = annotation ? \`<span style="color: var(--primary); font-weight: bold; margin-left: 2px;">\${annotation}</span>\` : '';

        html += \`<span class="view-move" data-line-id="\${line.id}" data-move-index="\${i}" onclick="event.stopPropagation(); showPositionFromLine(\${line.id}, \${i})" oncontextmenu="showViewContextMenu(event, \${line.id}, \${i})">\${history[i]}</span>\${annotationHtml} \`;
    }

    return html;
}

// Find a line that starts with the given path of moves
function findLineByPath(pathMoves) {
    const lines = repertoire[currentSide] || [];
    for (const line of lines) {
        const tempGame = new Chess();
        tempGame.load_pgn(line.pgn);
        const history = tempGame.history();

        // Check if the line starts with (or equals) this path
        if (history.length >= pathMoves.length) {
            let matches = true;
            for (let i = 0; i < pathMoves.length; i++) {
                if (history[i] !== pathMoves[i]) {
                    matches = false;
                    break;
                }
            }
            if (matches) return line;
        }
    }
    return null;
}

// --- NEW TREE HELPER FUNCTIONS ---

function buildCategoryTree(lines, repetitionSet) {
    // 1. Parse all lines into a structured tree
    const root = { children: {} };
    let moveIdCounter = 0; // Unique ID for each move span

    // Build a map of lineId -> annotations for quick lookup
    const lineAnnotationsMap = {};
    lines.forEach(line => {
        if (line.annotations) {
            lineAnnotationsMap[line.id] = line.annotations;
        }
    });

    lines.forEach(line => {
        // Use chess.js to get clean moves array
        const tempGame = new Chess();
        tempGame.load_pgn(line.pgn);
        const history = tempGame.history(); // Array of SAN moves ['e4', 'e5', 'Nf3']

        let currentNode = root;

        history.forEach((moveSan, index) => {
            if (!currentNode.children[moveSan]) {
                currentNode.children[moveSan] = {
                    move: moveSan,
                    children: {},
                    lineIds: [], // Stores IDs that end exactly here
                    ply: index + 1, // Move number logic (1=White, 2=Black)
                    annotations: {} // Store annotations by lineId
                };
            }
            // Store annotation for this move from this line
            if (line.annotations && line.annotations[index]) {
                currentNode.children[moveSan].annotations[line.id] = line.annotations[index];
            }
            currentNode = currentNode.children[moveSan];
        });

        // Mark the end of this specific line with the full path
        currentNode.lineIds.push({
            id: line.id,
            isRepetition: repetitionSet.has(line.pgn),
            path: history // Store the full path of moves
        });
    });

    // 2. Recursive Rendering Function
    function renderNode(node, depth, isFirstInBranch, pathSoFar = []) {
        let html = '';
        const childrenKeys = Object.keys(node.children);
        const hasChildren = childrenKeys.length > 0;
        const hasLineEnd = node.lineIds && node.lineIds.length > 0;

        // Move Number Logic
        const moveNum = Math.ceil(node.ply / 2);
        const isWhite = node.ply % 2 !== 0;
        const moveLabel = isWhite ? \`\${moveNum}. \${node.move}\` : (isFirstInBranch ? \`\${moveNum}<span class="tree-dots" style="margin:0">...</span> \${node.move}\` : node.move);

        // Current path including this move
        const currentPath = [...pathSoFar, node.move];
        const moveId = \`tree-move-\${moveIdCounter++}\`;
        const pathAttr = currentPath.join(',');
        const escapedPath = pathAttr.replace(/'/g, "\\\\'");

        // Get annotation for this move (use first annotation found if multiple lines have different annotations)
        const annotationValues = Object.values(node.annotations || {});
        const annotation = annotationValues.length > 0 ? annotationValues[0] : '';
        const annotationHtml = annotation ? \`<span style="color: var(--primary); font-weight: bold; margin-left: 2px;">\${annotation}</span>\` : '';

        // Render the Move with path data and context menu support
        html += \`<span class="tree-move" id="\${moveId}" data-path="\${pathAttr}" onclick="showPositionFromTreePath('\${escapedPath}')" oncontextmenu="showTreeMoveContextMenu(event, '\${escapedPath}')">\${moveLabel}</span>\${annotationHtml}\`;

        // Render Line Markers (Folder icons for actions)
        if (hasLineEnd) {
            node.lineIds.forEach(l => {
                const repClass = l.isRepetition ? 'repetition' : '';
                const linePath = l.path.join(',');
                // The marker allows interacting with the specific saved line
                html += \`<span class="tree-line-marker \${repClass}"
                    onclick="showTreeActions(event, \${l.id})"
                    onmouseenter="highlightTreePath('\${linePath}', \${l.isRepetition})"
                    onmouseleave="clearTreeHighlight()"
                    title="Optionen"><svg class="chess-icon icon-folder" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7V4h6l2 3h10v13H3Z"/></svg></span>\`;
            });
        }

        // Logic: Continue linearly or branch out?
        if (hasChildren) {
            if (childrenKeys.length === 1 && !hasLineEnd) {
                // Linear continuation (same line)
                html += ' ' + renderNode(node.children[childrenKeys[0]], depth, false, currentPath);
            } else {
                // Branching point (multiple options OR current node is an endpoint)
                html += \`<span class="tree-dots">...</span>\`;

                // Render children as new indented lines
                childrenKeys.forEach(childKey => {
                    const child = node.children[childKey];
                    // Arrows for branches
                    const arrow = \`<span class="tree-arrow"></span>\`;

                    html += \`<div class="tree-line tree-indent-level-\${depth + 1}">
                                \${arrow} \${renderNode(child, depth + 1, true, currentPath)}
                             </div>\`;
                });
            }
        }

        return html;
    }

    // Start rendering from root children
    let fullHtml = '';
    Object.keys(root.children).forEach(key => {
        fullHtml += \`<div class="tree-line tree-indent-level-0">
                        \${renderNode(root.children[key], 0, true, [])}
                     </div>\`;
    });

    return fullHtml;
}

// Helper to show context menu for tree nodes
function showTreeActions(e, id) {
    e.stopPropagation();

    // Remove existing menus
    document.querySelectorAll('.tree-action-menu').forEach(el => el.remove());

    // Check if this line is already in repetition
    const line = repertoire[currentSide].find(l => l.id === id);
    const isInRepetition = line && repertoire[currentSide].some(l => l.pgn === line.pgn && l.category === REPETITION_CAT);
    const repIcon = isInRepetition ? 'fas' : 'far';
    const repStyle = isInRepetition ? 'color:var(--warning)' : '';

    const menu = document.createElement('div');
    menu.className = 'tree-action-menu';
    menu.innerHTML = \`
        <button class="tree-action-btn" onclick="loadLinePreview(\${id}); removeTreeMenu()"><svg class="chess-icon icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s8-14 20 0c-12 14-20 0-20 0ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/></svg></button>
        <button class="tree-action-btn rep" onclick="toggleRepetitionFromList(\${id}); removeTreeMenu()" title="Wiederholung"><svg class="chess-icon icon-bookmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z"/></svg></button>
        <button class="tree-action-btn bot" onclick="startBotSetup(\${id}); removeTreeMenu()"><svg class="chess-icon icon-robot" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16v14H4ZM12 2v4M8 11h1m6 0h1M8 16h8M1 10v6m22-6v6"/></svg></button>
        <button class="tree-action-btn edit" onclick="editLine(\${id}); removeTreeMenu()"><svg class="chess-icon icon-pen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5 4 4M4 20l4-1L21 6l-4-4L4 15Z"/></svg></button>
        <button class="tree-action-btn del" onclick="deleteLine(\${id}); removeTreeMenu()"><svg class="chess-icon icon-trash" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/></svg></button>
    \`;

    menu.style.left = (e.pageX + 10) + 'px';
    menu.style.top = (e.pageY - 10) + 'px';

    document.body.appendChild(menu);

    // Close menu when clicking elsewhere
    const closeMenu = () => {
        menu.remove();
        document.removeEventListener('click', closeMenu);
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 0);
}

function removeTreeMenu() {
    document.querySelectorAll('.tree-action-menu').forEach(el => el.remove());
}

// Highlight all moves in a path when hovering over a line marker
function highlightTreePath(pathStr, isRepetition = false) {
    const pathMoves = pathStr.split(',');
    const highlightClass = isRepetition ? 'tree-move-highlighted-rep' : 'tree-move-highlighted';

    // Find all tree-move elements and check if their path is a prefix of the target path
    document.querySelectorAll('.tree-move[data-path]').forEach(el => {
        const elPath = el.getAttribute('data-path').split(',');

        // Check if this element's path is a prefix of the target path
        let isInPath = true;
        for (let i = 0; i < elPath.length; i++) {
            if (elPath[i] !== pathMoves[i]) {
                isInPath = false;
                break;
            }
        }

        if (isInPath && elPath.length <= pathMoves.length) {
            el.classList.add(highlightClass);
        }
    });
}

function clearTreeHighlight() {
    document.querySelectorAll('.tree-move-highlighted, .tree-move-highlighted-rep').forEach(el => {
        el.classList.remove('tree-move-highlighted');
        el.classList.remove('tree-move-highlighted-rep');
    });
}

// Show position from tree path (comma-separated moves)
function showPositionFromTreePath(path) {
    const moves = path.split(',');
    game.reset();
    let lastMove = null;
    for (const moveSan of moves) {
        lastMove = game.move(moveSan);
    }
    board.position(game.fen());
    if (lastMove) highlightLastMove(lastMove);
    updateViewSearch();
    if (isEngineRunning) startEvaluation();
}

// Show position from a stored line at specific move index
function showPositionFromLine(lineId, moveIndex) {
    const line = repertoire[currentSide].find(l => l.id === lineId);
    if (!line) return;

    const tempGame = new Chess();
    tempGame.load_pgn(line.pgn);
    const history = tempGame.history({ verbose: true });

    game.reset();
    let lastMove = null;
    for (let i = 0; i <= moveIndex && i < history.length; i++) {
        lastMove = game.move(history[i]);
    }
    board.position(game.fen());
    if (lastMove) highlightLastMove(lastMove);
    updateViewSearch();
    if (isEngineRunning) startEvaluation();
}

// Show position from import line at specific move index
function showPositionFromImportLine(lineIndex, moveIndex) {
    const pgn = parsedImportLines[lineIndex];
    if (!pgn) return;

    const tempGame = new Chess();
    try {
        tempGame.load_pgn(pgn);
    } catch (e) {
        return;
    }
    const history = tempGame.history({ verbose: true });

    game.reset();
    let lastMove = null;
    for (let i = 0; i <= moveIndex && i < history.length; i++) {
        lastMove = game.move(history[i]);
    }
    board.position(game.fen());
    if (lastMove) highlightLastMove(lastMove);

    // Show filter banner and filter import lines
    document.getElementById('import-filter-banner').classList.remove('hidden');
    renderImportLinesList(game.pgn());

    if (isEngineRunning) startEvaluation();
}

function renameCategory(oldName) { const newName = prompt("Neuer Name:", oldName); if (newName && newName.trim() !== "" && newName !== oldName) { repertoire[currentSide].forEach(line => { if (line.category === oldName) line.category = newName.trim(); }); saveData(); renderList(game.pgn()); } }
function deleteCategory(catName) { if(confirm(\`"\${catName}" löschen?\`)) { repertoire[currentSide] = repertoire[currentSide].filter(line => line.category !== catName); saveData(); renderList(game.pgn()); } }

function loadLinePreview(id) {
    const line = repertoire[currentSide].find(l => l.id === id);
    if(line) {
        game.load_pgn(line.pgn); board.position(game.fen());
        const history = game.history({verbose:true}); if(history.length) highlightLastMove(history[history.length-1]);
        updateViewSearch();
        // Only analyze if engine is on (Performance Fix)
        if (isEngineRunning) startEvaluation();
        drawShapes(); // Shapes laden
    }
}

function deleteLine(id) { if(confirm('Löschen?')) { repertoire[currentSide] = repertoire[currentSide].filter(l => l.id !== id); saveData(); renderList(game.pgn()); } }
function startAddingLine(preselectedCat) { resetBoardSearch(); editingId = null; let cat = (typeof preselectedCat === 'string') ? preselectedCat : ""; prepareEditor("Neue Variante", "", cat, {}, {}, {}); }
function editLine(id) { const line = repertoire[currentSide].find(l => l.id === id); if (!line) return; editingId = id; prepareEditor("Bearbeiten", line.pgn, line.category, line.comments || {}, line.shapes || {}, line.annotations || {}); }

// UPDATED PREPARE EDITOR (ACCEPTS SHAPES)
function prepareEditor(title, pgn, category, commentsData, shapesData, annotationsData) {
    mode = 'add'; switchUI('add-mode');

    // Apply user's preferred section order
    applyCreateModeOrder();

    document.getElementById('category-input').value = category;
    currentComments = JSON.parse(JSON.stringify(commentsData));
    currentShapes = JSON.parse(JSON.stringify(shapesData || {})); // Shapes laden
    currentAnnotations = JSON.parse(JSON.stringify(annotationsData || {})); // Annotations laden
    currentDisplayAnnotations = {}; // Reset display annotations

    // Restore analysis and database panel states from settings
    const btnAnalysis = document.getElementById('btn-analysis');
    const btnDatabase = document.getElementById('btn-database');
    const evalBar = document.getElementById('eval-bar-container');

    // Restore Stockfish analysis state
    analysisActive = userSettings.analysisOpen || false;
    if (analysisActive) {
        document.getElementById('analysis-section').classList.remove('hidden');
        if (btnAnalysis) btnAnalysis.classList.add('active');
        evalBar.classList.remove('hidden');
        runStockfishAnalysis();
    } else {
        document.getElementById('analysis-section').classList.add('hidden');
        if (btnAnalysis) btnAnalysis.classList.remove('active');
        // Hide eval bar only if engine is not running globally
        if (!isEngineRunning) {
            evalBar.classList.add('hidden');
        }
    }

    // Restore database state
    databaseActive = userSettings.databaseOpen !== undefined ? userSettings.databaseOpen : true;
    if (databaseActive) {
        document.getElementById('explorer-section').classList.remove('hidden');
        if (btnDatabase) btnDatabase.classList.add('active');
    } else {
        document.getElementById('explorer-section').classList.add('hidden');
        if (btnDatabase) btnDatabase.classList.remove('active');
    }

    const datalist = document.getElementById('category-datalist'); datalist.innerHTML = ''; Object.keys(getGroupedLines(currentSide)).forEach(cat => { const opt = document.createElement('option'); opt.value = cat; datalist.appendChild(opt); }); game.reset(); if (pgn) game.load_pgn(pgn); board.position(game.fen()); board.orientation(currentSide); const history = game.history({verbose:true});

    // Initialize keyboard navigation state
    addModeFullHistory = history.slice(); // Copy the history
    addModePreviewIndex = history.length > 0 ? history.length - 1 : -1;

    // Build display annotations from loaded annotations
    Object.keys(currentAnnotations).forEach(index => {
        const moveIndex = parseInt(index);
        if (history[moveIndex]) {
            currentDisplayAnnotations[history[moveIndex].to] = currentAnnotations[index];
        }
    });

    if(history.length) highlightLastMove(history[history.length-1]); else $('#board .square-55d63').removeClass('highlight-square'); updatePgnDisplay(); loadNoteForCurrentPos();
    drawShapes();
    updateOpeningExplorer(); // Load opening explorer for initial position
}

function updatePgnDisplay() {
    const pgnEl = document.getElementById('pgn-display');
    pgnEl.innerHTML = ''; // Clear content

    // Use full history in add mode (to preserve moves after going back)
    const history = (mode === 'add' && addModeFullHistory.length > 0)
        ? addModeFullHistory
        : game.history({ verbose: true });

    if (history.length === 0) {
        pgnEl.innerText = "Züge spielen...";
        return;
    }

    let moveNumber = 1;
    for (let i = 0; i < history.length; i++) {
        const move = history[i];
        if (i % 2 === 0) {
            const numSpan = document.createElement('span');
            numSpan.innerText = moveNumber + ". ";
            numSpan.style.color = "var(--text-muted)";
            pgnEl.appendChild(numSpan);
            moveNumber++;
        }

        const moveSpan = document.createElement('span');
        moveSpan.innerText = move.san;
        moveSpan.className = 'move-span';
        if (i === addModePreviewIndex) moveSpan.classList.add('active-move');
        moveSpan.dataset.index = i;
        // Left-click: preview board position after this move in add mode
        moveSpan.addEventListener('click', () => {
            if (mode !== 'add') return;
            previewToMoveIndex(i, addModeFullHistory);
        });
        moveSpan.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e.clientX, e.clientY, i);
        });
        pgnEl.appendChild(moveSpan);

        if (currentAnnotations[i]) {
            const annSpan = document.createElement('span');
            annSpan.innerText = currentAnnotations[i];
            annSpan.style.color = "var(--primary)";
            annSpan.style.fontWeight = "bold";
            annSpan.style.marginLeft = "2px";
            pgnEl.appendChild(annSpan);
        }

        pgnEl.appendChild(document.createTextNode(" "));
    }
    pgnEl.scrollTop = pgnEl.scrollHeight;
}

// Jump the game/board to the position after the given move index (0-based)
function previewToMoveIndex(index, movesList) {
    if (!Array.isArray(movesList) || movesList.length === 0) return;
    // Track the preview index
    addModePreviewIndex = index;
    // Reset and replay up to and including the selected move
    game.reset();
    for (let j = 0; j <= index && j < movesList.length; j++) {
        game.move(movesList[j]);
    }
    // Update board instantly, highlight last move
    const lastMove = movesList[Math.min(index, movesList.length - 1)];
    board.position(game.fen(), false);
    if (lastMove) highlightLastMove(lastMove);

    // Show note and only the annotation for this specific move (if present)
    currentDisplayAnnotations = {};
    if (currentAnnotations && currentAnnotations[index] && lastMove) {
        currentDisplayAnnotations[lastMove.to] = currentAnnotations[index];
    }
    loadNoteForCurrentPos();
    drawShapes();

    // Update PGN display to highlight active move
    updatePgnDisplay();

    // Optional: engine evaluation if running and not in bot/train
    if (isEngineRunning && mode !== 'bot' && mode !== 'train') {
        setTimeout(startEvaluation, 50);
    }

    // Update analysis if active
    if (analysisActive) {
        runStockfishAnalysis();
    }
}

// Navigate to start position (before any moves)
function goToStartPosition() {
    if (mode !== 'add') return;
    addModePreviewIndex = -1;
    game.reset();
    board.position(game.fen(), false);
    $('#board .square-55d63').removeClass('highlight-square');
    currentDisplayAnnotations = {};
    loadNoteForCurrentPos();
    drawShapes();
    updatePgnDisplay();
    if (isEngineRunning) setTimeout(startEvaluation, 50);
    if (analysisActive) runStockfishAnalysis();
}

// Navigate to end position (latest move)
function goToEndPosition(movesList) {
    if (mode !== 'add' || !Array.isArray(movesList) || movesList.length === 0) return;
    previewToMoveIndex(movesList.length - 1, movesList);
}

// --- UNDO FUNCTION ---
function undoLastMove() {
    // Get the move that will be undone
    const historyBefore = game.history({verbose: true});
    const moveToUndo = historyBefore[historyBefore.length - 1];

    // Remove last move from game
    const move = game.undo();
    if (move) {
        // Remove annotation for the undone move
        const undoneIndex = historyBefore.length - 1;
        delete currentAnnotations[undoneIndex];
        if (moveToUndo) {
            delete currentDisplayAnnotations[moveToUndo.to];
        }

        // Update Board
        board.position(game.fen());

        // Highlight the move before the one we just undid (if any)
        const history = game.history({verbose:true});
        if (history.length > 0) {
            highlightLastMove(history[history.length-1]);
        } else {
            $('#board .square-55d63').removeClass('highlight-square');
        }

        // Update UI components
        updatePgnDisplay();
        loadNoteForCurrentPos(); // Re-load notes/shapes for the previous position

        playSound('move');

        // Update analysis if in add mode
        updateAnalysisIfActive();
    }
}

function saveLine() {
    const pgn = game.pgn(); if (pgn.trim() === '') { alert("Keine Züge."); return; }
    const catInput = document.getElementById('category-input').value.trim();
    const category = catInput || "Allgemein";
    const moves = game.history({ verbose: true });

    // Save Shapes too!
    const lineData = { id: editingId || Date.now(), pgn, category, moves, comments: currentComments, shapes: currentShapes, annotations: currentAnnotations };

    if (editingId) { const index = repertoire[currentSide].findIndex(l => l.id === editingId); if (index !== -1) repertoire[currentSide][index] = lineData; } else repertoire[currentSide].push(lineData); saveData(); cancelAdd();
}
function cancelAdd() {
    mode = 'view';
    editingId = null;
    currentComments = {};
    currentShapes = {};
    currentAnnotations = {};
    currentDisplayAnnotations = {};
    // Reset analysis when leaving add mode
    if (analysisActive) {
        analysisActive = false;
        document.getElementById('analysis-section').classList.add('hidden');
        sendEngineCommand('stop');
        sendEngineCommand('setoption name MultiPV value 1');
    }
    // Always hide eval bar when leaving add mode (unless engine setting is on)
    if (!isEngineRunning) {
        document.getElementById('eval-bar-container').classList.add('hidden');
    }
    // Reset button states
    const btns = document.querySelectorAll('.analyze-btn');
    if (btns[0]) btns[0].classList.remove('active');
    if (btns[1]) btns[1].classList.remove('active');

    // Disable arrow draw mode when leaving add mode
    if (arrowDrawModeActive) {
        arrowDrawModeActive = false;
        arrowDrawFirstSquare = null;
        clearArrowDrawHighlight();
        const arrowBtn = document.getElementById('btn-arrow-draw');
        if (arrowBtn) arrowBtn.classList.remove('active');
        document.getElementById('arrow-color-popup')?.classList.add('hidden');
    }

    // Disable circle draw mode when leaving add mode
    if (circleDrawModeActive) {
        circleDrawModeActive = false;
        const circleBtn = document.getElementById('btn-circle-draw');
        if (circleBtn) circleBtn.classList.remove('active');
        document.getElementById('circle-color-popup')?.classList.add('hidden');
    }

    switchUI('view-mode');
    resetBoardSearch();
}
function annotateMove(annotation) {
    const history = game.history({ verbose: true });
    if (history.length === 0) return;
    const lastMoveIndex = history.length - 1;
    currentAnnotations[lastMoveIndex] = annotation;
    // Clear previous display annotations and add only the current one
    currentDisplayAnnotations = {};
    const lastMove = history[lastMoveIndex];
    currentDisplayAnnotations[lastMove.to] = annotation;
    updatePgnDisplay(); // Refresh the PGN display to show annotations
    drawShapes(); // Update the board display
}
function openSelectionMode() { if (repertoire[currentSide].length === 0) { alert("Nichts zum Üben."); return; } mode = 'selection'; switchUI('selection-mode'); resetSelectionBoardSearch(); }

function renderSelectionList(pgnFilter = null) {
    const list = document.getElementById('selection-list'); list.innerHTML = '';
    const groups = getGroupedLines(currentSide);
    const term = document.getElementById('search-input').value.toLowerCase();

    // Get repetition PGNs for tree highlighting
    const repetitionLines = repertoire[currentSide].filter(l => l.category === REPETITION_CAT);
    const repetitionPgns = new Set(repetitionLines.map(l => l.pgn));

    Object.keys(groups).sort().forEach(cat => {
        let lines = groups[cat].filter(l => l.pgn.toLowerCase().includes(term) || cat.toLowerCase().includes(term));

        // Additional filter by board position if pgnFilter is provided
        if (pgnFilter) {
            lines = lines.filter(l => l.pgn.startsWith(pgnFilter));
        }

        if (lines.length > 0) {
            const catClean = cat.replace(/[^a-zA-Z0-9]/g, '_');
            const header = document.createElement('div'); header.className = 'category-header';
            header.innerHTML = \`<div style="display:flex; align-items:center; gap:10px;"><input type="checkbox" checked onchange="toggleAllSelection(this, '\${catClean}')" onclick="event.stopPropagation()"><span>\${cat}</span></div>\`;
            list.appendChild(header);
            const contentDiv = document.createElement('div'); contentDiv.style.paddingLeft = "15px";

            // Use tree view if enabled
            if (userSettings.treeView && lines.length > 0) {
                const treeHTML = buildSelectionTree(lines, repetitionPgns, catClean);
                contentDiv.innerHTML = \`<div class="tree-container selection-tree">\${treeHTML}</div>\`;
            } else {
                lines.forEach(l => {
                    const isInRepetition = repetitionPgns.has(l.pgn);
                    const repClass = isInRepetition ? 'repetition' : '';
                    const div = document.createElement('label'); div.className = \`line-item selection-item \${repClass}\`;
                    div.innerHTML = \`<div style="display:flex; align-items:center;">
                        <span class="selection-checkbox \${repClass}">
                            <input type="checkbox" value="\${l.id}" checked class="chk-\${catClean}">
                            <svg class="chess-icon icon-check-square" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12v9H3V3h12m-8 8 4 4L21 4"/></svg>
                        </span>
                        <span>\${l.pgn}</span>
                    </div>\`;
                    contentDiv.appendChild(div);
                });
            }
            list.appendChild(contentDiv);
        }
    });
}

// Build tree for selection mode with checkboxes
function buildSelectionTree(lines, repetitionSet, catClass) {
    const root = { children: {} };
    let moveIdCounter = 0;

    lines.forEach(line => {
        const tempGame = new Chess();
        tempGame.load_pgn(line.pgn);
        const history = tempGame.history();

        let currentNode = root;

        history.forEach((moveSan, index) => {
            if (!currentNode.children[moveSan]) {
                currentNode.children[moveSan] = {
                    move: moveSan,
                    children: {},
                    lineIds: [],
                    ply: index + 1
                };
            }
            currentNode = currentNode.children[moveSan];
        });

        currentNode.lineIds.push({
            id: line.id,
            isRepetition: repetitionSet.has(line.pgn),
            path: history
        });
    });

    function renderNode(node, depth, isFirstInBranch, pathSoFar = []) {
        let html = '';
        const childrenKeys = Object.keys(node.children);
        const hasChildren = childrenKeys.length > 0;
        const hasLineEnd = node.lineIds && node.lineIds.length > 0;

        const moveNum = Math.ceil(node.ply / 2);
        const isWhite = node.ply % 2 !== 0;
        const moveLabel = isWhite ? \`\${moveNum}. \${node.move}\` : (isFirstInBranch ? \`\${moveNum}<span class="tree-dots" style="margin:0">...</span> \${node.move}\` : node.move);

        const currentPath = [...pathSoFar, node.move];
        const moveId = \`sel-tree-move-\${moveIdCounter++}\`;
        const pathAttr = currentPath.join(',');

        html += \`<span class="tree-move" id="\${moveId}" data-path="\${pathAttr}">\${moveLabel}</span>\`;

        // Render checkboxes for line endings
        if (hasLineEnd) {
            node.lineIds.forEach(l => {
                const repClass = l.isRepetition ? 'repetition' : '';
                html += \`<label class="tree-line-checkbox \${repClass}"
                    onmouseenter="highlightTreePath('\${l.path.join(',')}', \${l.isRepetition})"
                    onmouseleave="clearTreeHighlight()">
                    <input type="checkbox" value="\${l.id}" checked class="chk-\${catClass}">
                    <svg class="chess-icon icon-check-square" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12v9H3V3h12m-8 8 4 4L21 4"/></svg>
                </label>\`;
            });
        }

        if (hasChildren) {
            if (childrenKeys.length === 1 && !hasLineEnd) {
                html += ' ' + renderNode(node.children[childrenKeys[0]], depth, false, currentPath);
            } else {
                html += \`<span class="tree-dots">...</span>\`;

                childrenKeys.forEach(childKey => {
                    const child = node.children[childKey];
                    const arrow = \`<span class="tree-arrow"></span>\`;

                    html += \`<div class="tree-line tree-indent-level-\${depth + 1}">
                                \${arrow} \${renderNode(child, depth + 1, true, currentPath)}
                             </div>\`;
                });
            }
        }

        return html;
    }

    let fullHtml = '';
    Object.keys(root.children).forEach(key => {
        fullHtml += \`<div class="tree-line tree-indent-level-0">
                        \${renderNode(root.children[key], 0, true, [])}
                     </div>\`;
    });

    return fullHtml;
}
function toggleAllSelection(source, catClass) { document.querySelectorAll(\`.chk-\${catClass}\`).forEach(cb => cb.checked = source.checked); }
function startTrainingFromSelection() {
    const checked = document.querySelectorAll('#selection-list input[type="checkbox"]:not([onchange]):checked');
    if (checked.length === 0) return;
    trainingStats = { correct: 0, wrong: 0, wrongLines: [] };

    // Build selection, avoiding duplicates between natural and repetition entries
    const selectedLines = Array.from(checked).map(c => repertoire[currentSide].find(x => x.id == c.value)).filter(Boolean).map(l => JSON.parse(JSON.stringify(l)));

    // Group by PGN and prefer natural category entries over Wiederholung when both selected
    const byPgn = {};
    selectedLines.forEach(l => {
        if (!byPgn[l.pgn]) byPgn[l.pgn] = [];
        byPgn[l.pgn].push(l);
    });

    const finalList = [];
    Object.keys(byPgn).forEach(pgn => {
        const group = byPgn[pgn];
        const natural = group.filter(x => x.category !== REPETITION_CAT);
        if (natural.length > 0) {
            // use natural entries only
            natural.forEach(n => finalList.push(n));
        } else {
            // only repetition entries selected
            group.forEach(r => {
                // try to find the line's original category in the full repertoire
                const orig = repertoire[currentSide].find(x => x.pgn === r.pgn && x.category !== REPETITION_CAT);
                if (orig) r.originalCategory = orig.category;
                finalList.push(r);
            });
        }
    });

    trainingQueue = finalList.sort(() => Math.random() - 0.5);
    totalTrainingLines = trainingQueue.length;
    mode = 'train'; switchUI('train-mode'); nextTrainingLine();
}

function continueFromNote() { $('#training-note-display').fadeOut(); isPaused = false; if (pendingNextAction) { const action = pendingNextAction; pendingNextAction = null; action(); } }
function processGameStep(nextAction) {
    const fen = getCleanFen();
    const note = currentTrainLine.comments[fen];

    // Load shapes for this step
    if(currentTrainLine.shapes && currentTrainLine.shapes[fen]) {
        currentShapes = {[fen]: currentTrainLine.shapes[fen]};
    } else {
        currentShapes = {};
    }
    drawShapes();

    if (note) { $('#note-text').text(note); $('#training-note-display').css('display', 'flex').hide().fadeIn(); isPaused = true; pendingNextAction = nextAction; } else { $('#training-note-display').hide(); if (nextAction) nextAction(); }
}

function nextTrainingLine() {

    if (trainingQueue.length === 0) {
        showTrainingResults(); // Changed from stopTraining()
        return;
    }

    if (trainingQueue.length === 0) { stopTraining(); return; }
    updateProgress();
    currentTrainLine = trainingQueue[0];

    // When practicing a repetition entry, show its natural/original category if available
    const displayCat = (currentTrainLine.category === REPETITION_CAT && currentTrainLine.originalCategory) ? currentTrainLine.originalCategory : currentTrainLine.category;
    document.getElementById('train-category-display').innerText = displayCat;
    updateRepetitionButtonState();

    $('#training-note-display').hide(); isPaused = false;

    let tGame = new Chess(); tGame.load_pgn(currentTrainLine.pgn);
    currentTrainLine.moveHistory = tGame.history({ verbose: true });
    game.reset(); board.position(game.fen()); board.orientation(currentSide); currentMoveIndex = 0;

    // Reset Visuals
    $('#board .square-55d63').removeClass('highlight-square');
    currentShapes = {};
    currentTrainingAnnotations = {};
    drawShapes();

    updateTrainStatus("Dein Zug", "neutral");
    processGameStep(() => { if (currentSide === 'black') playBotMove(); });
}

function updateProgress() {
    const remaining = trainingQueue.length;
    const done = totalTrainingLines - remaining;
    const percent = (done / totalTrainingLines) * 100;
    document.getElementById('progress-fill').style.width = percent + '%';
    document.getElementById('progress-text-right').innerText = \`\${done} / \${totalTrainingLines}\`;
}

    function handleTrainingMove(move) {
        const expected = currentTrainLine.moveHistory[currentMoveIndex];
        if (!expected || (move.from === expected.from && move.to === expected.to)) {
            // Clear previous annotations and add only the current one
            currentTrainingAnnotations = {};
            const hasAnnotation = currentTrainLine.annotations && currentTrainLine.annotations[currentMoveIndex];
            if (hasAnnotation) {
                currentTrainingAnnotations[expected.to] = currentTrainLine.annotations[currentMoveIndex];
            }
            currentMoveIndex++;
            setTimeout(() => {
                processGameStep(() => {
                    if (!expected || currentMoveIndex >= currentTrainLine.moveHistory.length) {
                        successLine();
                    }
                    else {
                        // Add extra delay if user's move had an annotation
                        const delay = hasAnnotation ? 1200 : 400;
                        setTimeout(playBotMove, delay);
                    }
                });
            }, 100);
        } else {
            playSound('error');
            updateTrainStatus("FALSCH!", "error");

            // Track wrong move in line statistics
            if (!lineStats[currentTrainLine.id]) {
                lineStats[currentTrainLine.id] = { correct: 0, wrong: 0 };
            }
            lineStats[currentTrainLine.id].wrong++;
            localStorage.setItem('chessLineStats', JSON.stringify(lineStats));

            // Track wrong move
            if (!trainingStats.wrongLines.some(l => l.id === currentTrainLine.id)) {
                trainingStats.wrongLines.push({
                    id: currentTrainLine.id,
                    pgn: currentTrainLine.pgn,
                    category: currentTrainLine.category
                });
            }

            // IMMEDIATE RESET FOR WRONG MOVES
            setTimeout(() => {
                game.undo();
                board.position(game.fen(), false);
                setTimeout(() => {
                    updateTrainStatus("Dein Zug", "neutral");
                    drawShapes();
                }, 100);
            }, 500);
        }
    }

function playBotMove() {
    if (currentMoveIndex < currentTrainLine.moveHistory.length) {
        const botMove = currentTrainLine.moveHistory[currentMoveIndex];
        game.move(botMove);

        board.position(game.fen(), false);

        setTimeout(() => {
            playSound('move');
            highlightLastMove(botMove);
            // Clear previous annotations and add only the current one
            currentTrainingAnnotations = {};
            if (currentTrainLine.annotations && currentTrainLine.annotations[currentMoveIndex]) {
                currentTrainingAnnotations[botMove.to] = currentTrainLine.annotations[currentMoveIndex];
            }
            currentMoveIndex++;

            setTimeout(() => {
                processGameStep(() => {
                    if (currentMoveIndex >= currentTrainLine.moveHistory.length) {
                        successLine();
                    }
                });
                if(isEngineRunning) setTimeout(startEvaluation, 300);
            }, 100);
        }, 50);
    }
}

function successLine() {
    // Track correct line completion in statistics
    if (!lineStats[currentTrainLine.id]) {
        lineStats[currentTrainLine.id] = { correct: 0, wrong: 0 };
    }
    lineStats[currentTrainLine.id].correct++;
    localStorage.setItem('chessLineStats', JSON.stringify(lineStats));

    if (!trainingStats.wrongLines.some(l => l.id === currentTrainLine.id)) {
        trainingStats.correct++;
    }
    playSound('capture');
    trainingQueue.shift();
    const boardEl = document.getElementById('board');
    boardEl.style.boxShadow = "0 0 20px var(--success)";
    updateTrainStatus("RICHTIG!", "success");
    setTimeout(() => { boardEl.style.boxShadow = "var(--shadow)";
    updateTrainStatus("...", "neutral"); nextTrainingLine();
    }, 800);
}

function updateTrainStatus(t, className) { const e = document.getElementById('train-status'); e.innerText = t; e.className = \`status-badge \${className}\`; }
function repeatLater() { trainingQueue.push(trainingQueue.shift()); nextTrainingLine(); }
function stopTraining() { mode = 'view'; switchUI('view-mode'); resetBoardSearch(); isPaused = false; }
function switchUI(id) {
    document.querySelectorAll('.controls-area > div').forEach(d => d.classList.add('hidden'));
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('hidden');
        // Reset internal scroll so the menu content is visible top-aligned
        try { el.scrollTop = 0; } catch (e) {}
        const dash = el.querySelector('.training-dashboard'); if (dash) dash.scrollTop = 0;
    }
    if(id === 'view-mode' || id === 'settings-mode') document.querySelector('.header-row').classList.remove('hidden'); else document.querySelector('.header-row').classList.add('hidden');
    setTimeout(() => board.resize(), 200);
}
function saveData() { localStorage.setItem('chessRepertoire_v3', JSON.stringify(repertoire)); }

// --- PGN IMPORT WITH VARIATIONS ---
let parsedImportLines = [];
let importLineAnnotations = {}; // Track annotations for import lines: { lineIndex: { moveIndex: 'annotation' } }

function openImportPgn() {
    mode = 'import';
    switchUI('import-pgn-mode');
    // Clear previous data
    document.getElementById('import-category-input').value = '';
    document.getElementById('import-pgn-input').value = '';
    document.getElementById('import-preview').classList.add('hidden');
    document.getElementById('import-execute-btn').disabled = true;
    parsedImportLines = [];
    importLineAnnotations = {};

    // Set up live parsing on input
    document.getElementById('import-pgn-input').oninput = debounce(parseImportPgn, 300);
}

function cancelImportPgn() {
    mode = 'view';
    parsedImportLines = [];
    importLineAnnotations = {};

    // Reset board to starting position
    game.reset();
    board.position(game.fen());
    $('#board .square-55d63').removeClass('highlight-square');

    // Hide filter banner
    document.getElementById('import-filter-banner').classList.add('hidden');

    switchUI('view-mode');
}

// Reset import filter and show all lines
function resetImportFilter() {
    game.reset();
    board.position(game.fen());
    $('#board .square-55d63').removeClass('highlight-square');
    document.getElementById('import-filter-banner').classList.add('hidden');
    renderImportLinesList();
}

// Debounce helper for live parsing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Parse PGN with variations and extract all lines
function parseImportPgn() {
    const pgnInput = document.getElementById('import-pgn-input').value.trim();
    const preview = document.getElementById('import-preview');
    const linesList = document.getElementById('import-lines-list');
    const countEl = document.getElementById('import-lines-count');
    const executeBtn = document.getElementById('import-execute-btn');

    if (!pgnInput) {
        preview.classList.add('hidden');
        executeBtn.disabled = true;
        parsedImportLines = [];
        return;
    }

    // Extract all lines from PGN with variations
    parsedImportLines = extractLinesFromPgn(pgnInput);

    if (parsedImportLines.length === 0) {
        preview.classList.add('hidden');
        executeBtn.disabled = true;
        return;
    }

    // Show preview
    preview.classList.remove('hidden');
    executeBtn.disabled = false;

    // Render preview list
    renderImportLinesList();
}

function renderImportLinesList(filterPgn = null) {
    const linesList = document.getElementById('import-lines-list');
    linesList.innerHTML = '';

    // Get filter moves if filtering
    let filterMoves = [];
    if (filterPgn) {
        const filterGame = new Chess();
        filterGame.load_pgn(filterPgn);
        filterMoves = filterGame.history();
    }

    parsedImportLines.forEach((line, lineIndex) => {
        // If filtering, check if line starts with filter moves
        if (filterPgn) {
            const tempGame = new Chess();
            try {
                tempGame.load_pgn(line);
            } catch (e) {
                return; // Skip invalid lines
            }
            const lineMoves = tempGame.history();

            // Check if line starts with filter moves
            let matches = true;
            for (let i = 0; i < filterMoves.length; i++) {
                if (lineMoves[i] !== filterMoves[i]) {
                    matches = false;
                    break;
                }
            }
            if (!matches) return; // Skip non-matching lines
        }

        const div = document.createElement('div');
        div.className = 'line-item import-line-item';
        div.dataset.index = lineIndex;

        // Format moves like home page with context menu support
        const movesHtml = formatImportLineMoves(line, lineIndex);

        div.innerHTML = \`
            <span class="line-moves" id="import-line-pgn-\${lineIndex}">\${movesHtml}</span>
            <div class="line-actions">
                <button onclick="editImportLine(\${lineIndex})" title="Bearbeiten"><svg class="chess-icon icon-pen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5 4 4M4 20l4-1L21 6l-4-4L4 15Z"/></svg></button>
                <button class="del" onclick="deleteImportLine(\${lineIndex})" title="Löschen"><svg class="chess-icon icon-trash" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/></svg></button>
            </div>
        \`;
        linesList.appendChild(div);
    });
}

function formatImportLineMoves(pgn, lineIndex) {
    if (!pgn || pgn.trim() === '') return '<span class="view-move">Startposition</span>';

    const tempGame = new Chess();
    try {
        tempGame.load_pgn(pgn);
    } catch (e) {
        return pgn; // Return raw if can't parse
    }

    const history = tempGame.history();
    if (history.length === 0) return '<span class="view-move">Startposition</span>';

    // Get annotations for this line
    const lineAnnotations = importLineAnnotations[lineIndex] || {};

    let html = '';
    let moveNumber = 1;

    for (let i = 0; i < history.length; i++) {
        if (i % 2 === 0) {
            html += \`<span class="view-move-num">\${moveNumber}.</span>\`;
        }
        const annotation = lineAnnotations[i] || '';
        const annotationHtml = annotation ? \`<span style="color: var(--primary); font-weight: bold; margin-left: 2px;">\${annotation}</span>\` : '';
        html += \`<span class="view-move" onclick="showPositionFromImportLine(\${lineIndex}, \${i})" oncontextmenu="showImportContextMenu(event, \${lineIndex}, \${i})">\${history[i]}</span>\${annotationHtml} \`;
        if (i % 2 === 1) moveNumber++;
    }

    return html.trim();
}

function editImportLine(index) {
    const pgnSpan = document.getElementById(\`import-line-pgn-\${index}\`);
    const currentPgn = parsedImportLines[index];

    // Replace span with input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'import-line-edit-input';
    input.value = currentPgn;
    input.dataset.index = index;

    // Handle save on enter or blur
    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            saveImportLineEdit(index, input.value);
        } else if (e.key === 'Escape') {
            renderImportLinesList(); // Cancel edit
        }
    };
    input.onblur = () => {
        saveImportLineEdit(index, input.value);
    };

    pgnSpan.replaceWith(input);
    input.focus();
    input.select();
}

function saveImportLineEdit(index, newPgn) {
    // Validate the PGN using chess.js
    const tempGame = new Chess();
    try {
        if (tempGame.load_pgn(newPgn)) {
            parsedImportLines[index] = tempGame.pgn();
        } else if (newPgn.trim() === '') {
            // Empty = will be filtered out on import
            parsedImportLines[index] = '';
        } else {
            // Try to validate moves manually
            const validated = validateAndFormatPgn(newPgn);
            parsedImportLines[index] = validated || newPgn;
        }
    } catch (e) {
        parsedImportLines[index] = newPgn;
    }

    renderImportLinesList();
}

function validateAndFormatPgn(pgn) {
    const tempGame = new Chess();
    // Try to parse moves from the string
    const moves = pgn.replace(/\\d+\\.\\s*/g, '').trim().split(/\\s+/);
    for (const move of moves) {
        if (!move) continue;
        try {
            const result = tempGame.move(move);
            if (!result) return null;
        } catch (e) {
            return null;
        }
    }
    return tempGame.pgn();
}

function deleteImportLine(index) {
    parsedImportLines.splice(index, 1);

    // Re-index annotations: shift all indices after the deleted one
    const newAnnotations = {};
    for (const lineIdx in importLineAnnotations) {
        const idx = parseInt(lineIdx);
        if (idx < index) {
            newAnnotations[idx] = importLineAnnotations[idx];
        } else if (idx > index) {
            newAnnotations[idx - 1] = importLineAnnotations[idx];
        }
        // idx === index is skipped (deleted)
    }
    importLineAnnotations = newAnnotations;

    renderImportLinesList();

    // Disable import button if no lines left
    if (parsedImportLines.length === 0) {
        document.getElementById('import-execute-btn').disabled = true;
        document.getElementById('import-preview').classList.add('hidden');
    }
}

// Core parser: extract all main lines from PGN with variations
function extractLinesFromPgn(pgn) {
    // Clean up PGN: remove headers, comments, result markers
    let cleaned = pgn
        .replace(/\\[.*?\\]/g, '')           // Remove headers [Event "..."]
        .replace(/\\{[^}]*\\}/g, '')         // Remove comments {comment}
        .replace(/\\$\\d+/g, '')             // Remove NAG annotations $1, $2, etc.
        .replace(/\\s*1-0\\s*$/, '')         // Remove result 1-0
        .replace(/\\s*0-1\\s*$/, '')         // Remove result 0-1
        .replace(/\\s*1\\/2-1\\/2\\s*$/, '')   // Remove result 1/2-1/2
        .replace(/\\s*\\*\\s*$/, '')          // Remove unfinished marker *
        .replace(/\\?\\!|\\!\\?|\\?\\?|\\!\\!|\\?|\\!/g, '') // Remove move annotations
        .replace(/\\s+/g, ' ')              // Normalize whitespace
        .trim();

    if (!cleaned) return [];

    // Parse the moves recursively, handling variations
    const lines = [];
    parseVariations(cleaned, [], lines);

    // Convert move arrays to PGN strings
    return lines.map(movesToPgn).filter(pgn => pgn.length > 0);
}

// Recursively parse variations and collect all lines
function parseVariations(text, currentMoves, allLines) {
    let pos = 0;
    let moves = [...currentMoves];

    while (pos < text.length) {
        // Skip whitespace
        while (pos < text.length && /\\s/.test(text[pos])) pos++;
        if (pos >= text.length) break;

        // Check for variation start
        if (text[pos] === '(') {
            // Find matching closing parenthesis
            let depth = 1;
            let varStart = pos + 1;
            pos++;
            while (pos < text.length && depth > 0) {
                if (text[pos] === '(') depth++;
                else if (text[pos] === ')') depth--;
                pos++;
            }
            let varEnd = pos - 1;
            let varText = text.substring(varStart, varEnd);

            // Parse variation from the parent position (before last move)
            let parentMoves = moves.slice(0, -1);
            parseVariations(varText, parentMoves, allLines);
            continue;
        }

        // Check for variation end (shouldn't happen at top level)
        if (text[pos] === ')') {
            pos++;
            continue;
        }

        // Parse move number (e.g., "1.", "1...", "12.")
        let moveNumMatch = text.substring(pos).match(/^(\\d+\\.+\\s*)/);
        if (moveNumMatch) {
            pos += moveNumMatch[0].length;
            continue;
        }

        // Parse move (e.g., "e4", "Nf3", "O-O", "exd5", "Qxf7+")
        let moveMatch = text.substring(pos).match(/^([KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](?:=[QRBN])?[+#]?|O-O-O|O-O)/);
        if (moveMatch) {
            moves.push(moveMatch[1]);
            pos += moveMatch[0].length;
            continue;
        }

        // Skip any unrecognized character
        pos++;
    }

    // Add this line if it has moves
    if (moves.length > 0) {
        allLines.push([...moves]);
    }
}

// Convert array of moves to PGN string
function movesToPgn(moves) {
    // Use chess.js to validate and format moves
    const tempGame = new Chess();
    let validMoves = [];

    for (let move of moves) {
        try {
            const result = tempGame.move(move);
            if (result) {
                validMoves.push(result.san);
            } else {
                break; // Stop at first invalid move
            }
        } catch (e) {
            break;
        }
    }

    return tempGame.pgn();
}

// Execute the import: add all parsed lines to repertoire
function executeImportPgn() {
    const category = document.getElementById('import-category-input').value.trim() || 'Importiert';

    if (parsedImportLines.length === 0) {
        alert('Keine gültigen Linien gefunden.');
        return;
    }

    let addedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < parsedImportLines.length; i++) {
        const pgn = parsedImportLines[i];

        // Check if this line already exists
        const exists = repertoire[currentSide].some(l => l.pgn === pgn);
        if (exists) {
            skippedCount++;
            continue;
        }

        // Create line data
        const tempGame = new Chess();
        tempGame.load_pgn(pgn);
        const moves = tempGame.history({ verbose: true });

        // Get annotations for this line
        const lineAnnotations = importLineAnnotations[i] || {};

        const lineData = {
            id: Date.now() + addedCount, // Ensure unique IDs
            pgn: pgn,
            category: category,
            moves: moves,
            comments: {},
            shapes: {},
            annotations: { ...lineAnnotations }
        };

        repertoire[currentSide].push(lineData);
        addedCount++;
    }

    saveData();

    // Show result message
    let message = \`\${addedCount} Linie\${addedCount !== 1 ? 'n' : ''} importiert\`;
    if (skippedCount > 0) {
        message += \` (\${skippedCount} bereits vorhanden)\`;
    }
    alert(message);

    // Return to view mode and refresh
    cancelImportPgn();
    renderList();
}

function loadNoteForCurrentPos() {
    const fen = getCleanFen();
    const noteEl = document.getElementById('move-note-input');
    if(noteEl) noteEl.value = currentComments[fen] || "";
    drawShapes();
}
const noteInputEl = document.getElementById('move-note-input');
if (noteInputEl) {
    noteInputEl.addEventListener('input', function() {
        const fen = getCleanFen();
        if(this.value.trim() === "") delete currentComments[fen];
        else currentComments[fen] = this.value;
    });
}

// Arrow drawing logic is now in board.js

// Keyboard shortcut: Shift+Z clears all arrows for current position
document.addEventListener('keydown', (e) => {
    // Don't handle shortcuts when typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if ((e.key === 'Z' || e.key === 'z') && e.shiftKey) {
        clearShapesForCurrentPos();
        // brief visual cue on the board
        const boardEl = document.getElementById('board');
        if (boardEl) {
            boardEl.classList.add('flash-clear-shapes');
            setTimeout(() => boardEl.classList.remove('flash-clear-shapes'), 220);
        }
        e.preventDefault();
        return;
    }

    // Arrow key navigation in add mode
    if (mode === 'add') {
        const fullHistory = addModeFullHistory;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (fullHistory.length === 0) return;

            // If at start, stay at start
            if (addModePreviewIndex === -1) return;

            // If at position 0, go to start
            if (addModePreviewIndex === 0) {
                goToStartPosition();
            } else {
                // Go one move back
                previewToMoveIndex(addModePreviewIndex - 1, fullHistory);
            }
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (fullHistory.length === 0) return;

            // If at start (-1), go to first move
            if (addModePreviewIndex === -1) {
                previewToMoveIndex(0, fullHistory);
            } else if (addModePreviewIndex < fullHistory.length - 1) {
                // Go one move forward
                previewToMoveIndex(addModePreviewIndex + 1, fullHistory);
            }
        }
    }
});

// --- CONTEXT MENU LOGIC ---
let contextMenuTargetIndex = null;
let viewModeEditLineId = null; // Track which line is being edited in view mode
let treeMoveContextPath = null; // Track path for tree move context menu
let importModeLineIndex = null; // Track which import line is being edited

function showContextMenu(x, y, index) {
    contextMenuTargetIndex = index;
    viewModeEditLineId = null; // Reset view mode editing
    treeMoveContextPath = null; // Reset tree path
    importModeLineIndex = null; // Reset import mode
    const menu = document.getElementById('move-context-menu');
    // Reset submenu visibility each time
    const submenu = document.getElementById('annotation-submenu');
    if (submenu) submenu.classList.add('hidden');
    // Show delete option in add mode
    const deleteItem = document.getElementById('ctx-delete-move');
    if (deleteItem) deleteItem.classList.remove('hidden');
    // Show annotation option in add mode
    const addItem = document.getElementById('ctx-add-annotation');
    if (addItem) addItem.classList.remove('hidden');
    // Hide view position in add mode (not needed there)
    const viewPosItem = document.getElementById('ctx-view-position');
    if (viewPosItem) viewPosItem.classList.add('hidden');

    // Position menu, adjusting if it would go off-screen
    menu.style.left = '0px';
    menu.style.top = '0px';
    menu.classList.remove('hidden');

    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let finalX = x;
    let finalY = y;

    // Adjust horizontal position if menu would go off-screen
    if (x + menuRect.width > viewportWidth) {
        finalX = viewportWidth - menuRect.width - 10;
    }

    // Adjust vertical position if menu would go off-screen
    if (y + menuRect.height > viewportHeight) {
        finalY = viewportHeight - menuRect.height - 10;
    }

    // Ensure menu doesn't go above or left of viewport
    if (finalX < 10) finalX = 10;
    if (finalY < 10) finalY = 10;

    menu.style.left = finalX + 'px';
    menu.style.top = finalY + 'px';
}

// Show context menu for view mode (list of openings)
function showViewContextMenu(e, lineId, moveIndex) {
    e.preventDefault();
    e.stopPropagation();

    contextMenuTargetIndex = moveIndex;
    viewModeEditLineId = lineId;
    treeMoveContextPath = null; // Reset tree path
    importModeLineIndex = null; // Reset import mode

    const menu = document.getElementById('move-context-menu');
    const submenu = document.getElementById('annotation-submenu');
    if (submenu) submenu.classList.add('hidden');

    // Show delete option in view mode
    const deleteItem = document.getElementById('ctx-delete-move');
    if (deleteItem) deleteItem.classList.remove('hidden');

    // Show annotation option in view mode too
    const addItem = document.getElementById('ctx-add-annotation');
    if (addItem) addItem.classList.remove('hidden');

    // Show view position option in view mode
    const viewPosItem = document.getElementById('ctx-view-position');
    if (viewPosItem) viewPosItem.classList.remove('hidden');

    // Position menu
    menu.style.left = '0px';
    menu.style.top = '0px';
    menu.classList.remove('hidden');

    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let finalX = e.clientX;
    let finalY = e.clientY;

    if (e.clientX + menuRect.width > viewportWidth) {
        finalX = viewportWidth - menuRect.width - 10;
    }
    if (e.clientY + menuRect.height > viewportHeight) {
        finalY = viewportHeight - menuRect.height - 10;
    }
    if (finalX < 10) finalX = 10;
    if (finalY < 10) finalY = 10;

    menu.style.left = finalX + 'px';
    menu.style.top = finalY + 'px';
}

// Show context menu for import mode moves
function showImportContextMenu(e, lineIndex, moveIndex) {
    e.preventDefault();
    e.stopPropagation();

    contextMenuTargetIndex = moveIndex;
    viewModeEditLineId = null; // Reset view mode
    treeMoveContextPath = null; // Reset tree path
    importModeLineIndex = lineIndex; // Track import line

    const menu = document.getElementById('move-context-menu');
    const submenu = document.getElementById('annotation-submenu');
    if (submenu) submenu.classList.add('hidden');

    // Show view position option in import mode
    const viewPosItem = document.getElementById('ctx-view-position');
    if (viewPosItem) viewPosItem.classList.remove('hidden');

    // Show delete option in import mode
    const deleteItem = document.getElementById('ctx-delete-move');
    if (deleteItem) deleteItem.classList.remove('hidden');

    // Show annotation option in import mode
    const addItem = document.getElementById('ctx-add-annotation');
    if (addItem) addItem.classList.remove('hidden');

    // Position menu
    menu.style.left = '0px';
    menu.style.top = '0px';
    menu.classList.remove('hidden');

    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let finalX = e.clientX;
    let finalY = e.clientY;

    if (e.clientX + menuRect.width > viewportWidth) {
        finalX = viewportWidth - menuRect.width - 10;
    }
    if (e.clientY + menuRect.height > viewportHeight) {
        finalY = viewportHeight - menuRect.height - 10;
    }
    if (finalX < 10) finalX = 10;
    if (finalY < 10) finalY = 10;

    menu.style.left = finalX + 'px';
    menu.style.top = finalY + 'px';
}

// Show context menu for tree view moves
function showTreeMoveContextMenu(e, path) {
    e.preventDefault();
    e.stopPropagation();

    treeMoveContextPath = path; // Store the path for viewing position
    importModeLineIndex = null; // Reset import mode

    // Find the first line that matches this path for delete/annotation operations
    const pathMoves = path.split(',');
    const matchingLine = findLineByPath(pathMoves);

    if (matchingLine) {
        viewModeEditLineId = matchingLine.id;
        contextMenuTargetIndex = pathMoves.length - 1; // Index of the clicked move
    } else {
        viewModeEditLineId = null;
        contextMenuTargetIndex = null;
    }

    const menu = document.getElementById('move-context-menu');
    const submenu = document.getElementById('annotation-submenu');
    if (submenu) submenu.classList.add('hidden');

    // Show all options (delete and annotation work on the first matching line)
    const deleteItem = document.getElementById('ctx-delete-move');
    if (deleteItem) deleteItem.classList.toggle('hidden', !matchingLine);
    const addItem = document.getElementById('ctx-add-annotation');
    if (addItem) addItem.classList.toggle('hidden', !matchingLine);

    // Show view position option
    const viewPosItem = document.getElementById('ctx-view-position');
    if (viewPosItem) viewPosItem.classList.remove('hidden');

    // Position menu
    menu.style.left = '0px';
    menu.style.top = '0px';
    menu.classList.remove('hidden');

    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let finalX = e.clientX;
    let finalY = e.clientY;

    if (e.clientX + menuRect.width > viewportWidth) {
        finalX = viewportWidth - menuRect.width - 10;
    }
    if (e.clientY + menuRect.height > viewportHeight) {
        finalY = viewportHeight - menuRect.height - 10;
    }
    if (finalX < 10) finalX = 10;
    if (finalY < 10) finalY = 10;

    menu.style.left = finalX + 'px';
    menu.style.top = finalY + 'px';
}

function executeDeleteMove() {
    if (contextMenuTargetIndex !== null) {
        if (importModeLineIndex !== null) {
            // Import mode: edit the import line
            deleteMoveFromImportLine(importModeLineIndex, contextMenuTargetIndex);
        } else if (viewModeEditLineId !== null) {
            // View mode: edit the stored line directly
            deleteMoveFromLine(viewModeEditLineId, contextMenuTargetIndex);
        } else {
            // Add mode: edit current game
            deleteMoveFrom(contextMenuTargetIndex);
        }
    }
    document.getElementById('move-context-menu').classList.add('hidden');
}

// Delete move from import line
function deleteMoveFromImportLine(lineIndex, moveIndex) {
    const pgn = parsedImportLines[lineIndex];
    if (!pgn) return;

    const tempGame = new Chess();
    try {
        tempGame.load_pgn(pgn);
    } catch (e) {
        return;
    }

    const history = tempGame.history();

    // Rebuild game up to the deleted move
    tempGame.reset();
    for (let i = 0; i < moveIndex; i++) {
        tempGame.move(history[i]);
    }

    // Update the import line
    parsedImportLines[lineIndex] = tempGame.pgn();

    // Re-render
    renderImportLinesList();
}

// View position after a specific move (view mode or tree mode)
function executeViewPosition() {
    // Handle import mode context menu
    if (importModeLineIndex !== null && contextMenuTargetIndex !== null) {
        const pgn = parsedImportLines[importModeLineIndex];
        if (!pgn) {
            document.getElementById('move-context-menu').classList.add('hidden');
            return;
        }

        const tempGame = new Chess();
        tempGame.load_pgn(pgn);
        const history = tempGame.history({ verbose: true });

        // Update the main board to show this position
        game.reset();
        for (let i = 0; i <= contextMenuTargetIndex && i < history.length; i++) {
            game.move(history[i]);
        }
        board.position(game.fen());

        // Highlight the last move
        if (history[contextMenuTargetIndex]) {
            highlightLastMove(history[contextMenuTargetIndex]);
        }

        // Show filter banner and filter import lines
        document.getElementById('import-filter-banner').classList.remove('hidden');
        renderImportLinesList(game.pgn());

        // Run engine evaluation if enabled
        if (isEngineRunning) startEvaluation();

        document.getElementById('move-context-menu').classList.add('hidden');
        return;
    }

    // Handle tree view context menu
    if (treeMoveContextPath !== null) {
        const moves = treeMoveContextPath.split(',');
        game.reset();
        let lastMove = null;
        for (const moveSan of moves) {
            lastMove = game.move(moveSan);
        }
        board.position(game.fen());
        if (lastMove) highlightLastMove(lastMove);
        updateViewSearch();
        if (isEngineRunning) startEvaluation();
        document.getElementById('move-context-menu').classList.add('hidden');
        return;
    }

    // Handle normal list view context menu
    if (viewModeEditLineId === null || contextMenuTargetIndex === null) return;

    const line = repertoire[currentSide].find(l => l.id === viewModeEditLineId);
    if (!line) return;

    const tempGame = new Chess();
    tempGame.load_pgn(line.pgn);
    const history = tempGame.history({ verbose: true });

    // Update the main board to show this position
    game.reset();
    for (let i = 0; i <= contextMenuTargetIndex && i < history.length; i++) {
        game.move(history[i]);
    }
    board.position(game.fen());

    // Highlight the last move
    if (history[contextMenuTargetIndex]) {
        highlightLastMove(history[contextMenuTargetIndex]);
    }

    // Update view search to show matching lines
    updateViewSearch();

    // Run engine evaluation if enabled
    if (isEngineRunning) startEvaluation();

    document.getElementById('move-context-menu').classList.add('hidden');
}

// Delete move from a stored line (view mode)
function deleteMoveFromLine(lineId, index) {
    const line = repertoire[currentSide].find(l => l.id === lineId);
    if (!line) return;

    const tempGame = new Chess();
    tempGame.load_pgn(line.pgn);
    const history = tempGame.history({ verbose: true });

    // Rebuild game up to the deleted move
    tempGame.reset();
    for (let i = 0; i < index; i++) {
        tempGame.move(history[i]);
    }

    // Update line PGN
    line.pgn = tempGame.pgn();

    // Clean up annotations for deleted moves
    if (line.annotations) {
        const newAnnotations = {};
        for (let i = 0; i < index; i++) {
            if (line.annotations[i]) {
                newAnnotations[i] = line.annotations[i];
            }
        }
        line.annotations = newAnnotations;
    }

    // Clean up comments for positions that no longer exist
    if (line.comments) {
        const newComments = {};
        tempGame.reset();
        for (let i = 0; i <= index && i < history.length; i++) {
            const fen = tempGame.fen().split(' ').slice(0, 4).join(' ');
            if (line.comments[fen]) {
                newComments[fen] = line.comments[fen];
            }
            if (history[i]) tempGame.move(history[i]);
        }
        line.comments = newComments;
    }

    saveData();
    renderList(game.pgn());
    playSound('move');
}

function deleteMoveFrom(index) {
    const history = game.history({verbose: true});
    // Reset game and replay moves up to index-1
    game.reset();
    for (let i = 0; i < index; i++) {
        game.move(history[i]);
    }

    // Clean up annotations for deleted moves
    for (let i = index; i < history.length; i++) {
        delete currentAnnotations[i];
    }

    board.position(game.fen());
    updatePgnDisplay();
    loadNoteForCurrentPos();
    drawShapes();
    playSound('move');
}

// Hide context menu on global click
document.addEventListener('click', (e) => {
    const menu = document.getElementById('move-context-menu');
    if (menu && !menu.classList.contains('hidden')) {
        // Don't close if clicking inside the menu
        if (menu.contains(e.target)) return;
        menu.classList.add('hidden');
    }
});

// Allow scrolling inside the context menu
document.addEventListener('wheel', (e) => {
    const menu = document.getElementById('move-context-menu');
    if (menu && menu.contains(e.target)) {
        e.stopPropagation();
    }
}, { passive: true });

// --- Annotation add flow via context menu ---
function executeAddAnnotation() {
    const submenu = document.getElementById('annotation-submenu');
    const menu = document.getElementById('move-context-menu');
    if (submenu) {
        submenu.classList.remove('hidden');

        // Reposition menu after submenu is shown to keep it on screen
        if (menu) {
            const menuRect = menu.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            let newTop = menuRect.top;
            let newLeft = menuRect.left;

            // If menu now extends beyond viewport bottom, move it up
            if (menuRect.bottom > viewportHeight - 10) {
                newTop = Math.max(10, viewportHeight - menuRect.height - 10);
            }

            // If menu extends beyond viewport right, move it left
            if (menuRect.right > viewportWidth - 10) {
                newLeft = Math.max(10, viewportWidth - menuRect.width - 10);
            }

            menu.style.top = newTop + 'px';
            menu.style.left = newLeft + 'px';
        }
    }
}

function pickAnnotation(symbol) {
    if (contextMenuTargetIndex === null) return;

    if (importModeLineIndex !== null) {
        // Import mode: add annotation to import line
        annotateImportLineMove(importModeLineIndex, contextMenuTargetIndex, symbol);
    } else if (viewModeEditLineId !== null) {
        // View mode: edit the stored line directly
        annotateLineMove(viewModeEditLineId, contextMenuTargetIndex, symbol);
    } else if (mode === 'add') {
        // Add mode: edit current game
        annotateMoveAtIndex(contextMenuTargetIndex, symbol);
    }

    const menu = document.getElementById('move-context-menu');
    if (menu) menu.classList.add('hidden');
}

// Add annotation to import line move
function annotateImportLineMove(lineIndex, moveIndex, annotation) {
    const pgn = parsedImportLines[lineIndex];
    if (!pgn) return;

    // Initialize annotation storage for this line if needed
    if (!importLineAnnotations[lineIndex]) {
        importLineAnnotations[lineIndex] = {};
    }

    // Toggle annotation if same one is clicked again
    if (importLineAnnotations[lineIndex][moveIndex] === annotation) {
        delete importLineAnnotations[lineIndex][moveIndex];
    } else {
        importLineAnnotations[lineIndex][moveIndex] = annotation;
    }

    // Re-render
    renderImportLinesList();
}

// Add annotation to a stored line (view mode)
function annotateLineMove(lineId, index, annotation) {
    const line = repertoire[currentSide].find(l => l.id === lineId);
    if (!line) return;

    if (!line.annotations) line.annotations = {};

    // Toggle annotation if same one is clicked again
    if (line.annotations[index] === annotation) {
        delete line.annotations[index];
    } else {
        line.annotations[index] = annotation;
    }

    saveData();
    renderList(game.pgn());
}

function annotateMoveAtIndex(index, annotation) {
    const history = game.history({ verbose: true });
    if (!history[index]) return;
    currentAnnotations[index] = annotation;
    // Display only this annotation for add-mode
    currentDisplayAnnotations = {};
    const mv = history[index];
    currentDisplayAnnotations[mv.to] = annotation;
    updatePgnDisplay();
    drawShapes();
}


    function showTrainingResults() {
    const total = trainingStats.correct + trainingStats.wrongLines.length;
    const accuracy = total > 0 ? Math.round((trainingStats.correct / total) * 100) : 0;

    // Update stats
    document.getElementById('stat-correct').innerText = trainingStats.correct;
    document.getElementById('stat-wrong').innerText = trainingStats.wrongLines.length;
    document.getElementById('stat-accuracy').innerText = accuracy + '%';

    // Determine performance level
    const icon = document.getElementById('results-icon');
    const title = document.getElementById('results-title');
    const subtitle = document.getElementById('results-subtitle');

    if (accuracy === 100) {
        icon.className = 'results-icon perfect';
        icon.innerHTML = '<svg class="chess-icon icon-trophy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3h8v7c0 6-8 6-8 0ZM8 5H3v4c0 4 5 4 5 4M16 5h5v4c0 4-5 4-5 4M12 14v6M7 21h10"/></svg>';
        title.innerText = 'Perfekt!';
        subtitle.innerText = 'Du hast alle Varianten gemeistert!';
    } else if (accuracy >= 70) {
        icon.className = 'results-icon good';
        icon.innerHTML = '<svg class="chess-icon icon-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 3 6 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1Z"/></svg>';
        title.innerText = 'Gut gemacht!';
        subtitle.innerText = 'Starke Leistung, weiter so!';
    } else {
        icon.className = 'results-icon needs-work';
        icon.innerHTML = '<svg class="chess-icon icon-chart-line" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18M6 15l5-5 4 3 6-8"/></svg>';
        title.innerText = 'Training abgeschlossen';
        subtitle.innerText = 'Übung macht den Meister!';
    }

    // Handle wrong lines section
    const container = document.getElementById('wrong-lines-container');
    const actionsDiv = document.getElementById('results-actions');

    if (trainingStats.wrongLines.length > 0) {
        container.innerHTML = \`
            <div class="wrong-lines-section">
                <div class="wrong-lines-header">
                    <svg class="chess-icon icon-exclamation-triangle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 10 18H2ZM12 9v5m0 3v.1"/></svg>
                    <span>Fehlerhafte Varianten (\${trainingStats.wrongLines.length})</span>
                </div>
                <div class="wrong-lines-list">
                    \${trainingStats.wrongLines.map(line => \`
                        <div class="wrong-line-item">\${line.pgn}</div>
                    \`).join('')}
                </div>
            </div>
            <div class="results-question">
                <svg class="chess-icon icon-bookmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z"/></svg>
                Diese Varianten zur Wiederholung hinzufügen?
            </div>
        \`;

        actionsDiv.innerHTML = \`
            <button class="results-btn primary" onclick="addWrongLinesToRepetition()">
                <svg class="chess-icon icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg> Ja, hinzufügen
            </button>
            <button class="results-btn secondary" onclick="closeTrainingResults()">
                <svg class="chess-icon icon-times" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg> Nein, danke
            </button>
        \`;
    } else {
        container.innerHTML = \`
            <div class="no-wrong-lines">
                <svg class="chess-icon icon-check-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 12 3 3 7-7M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"/></svg>
                <p>Keine Fehler!</p>
                <span>Du hast alle Varianten perfekt gespielt.</span>
            </div>
        \`;

        actionsDiv.innerHTML = \`
            <button class="results-btn secondary" onclick="closeTrainingResults()">
                <svg class="chess-icon icon-times" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg> Schließen
            </button>
        \`;
    }

    // Show overlay
    document.getElementById('training-results-overlay').style.display = 'flex';
}

function addWrongLinesToRepetition() {
    trainingStats.wrongLines.forEach(wrongLine => {
        const alreadyExists = repertoire[currentSide].some(l =>
            l.pgn === wrongLine.pgn && l.category === REPETITION_CAT
        );

        if (!alreadyExists) {
            const newLine = JSON.parse(JSON.stringify(
                repertoire[currentSide].find(l => l.id === wrongLine.id)
            ));
            newLine.id = Date.now() + Math.random(); // Unique ID
            newLine.category = REPETITION_CAT;
            repertoire[currentSide].unshift(newLine);
        }
    });

    saveData();
    closeTrainingResults();
}

function closeTrainingResults() {
    document.getElementById('training-results-overlay').style.display = 'none';
    stopTraining();
}

// --- STOCKFISH ANALYSIS MENU ---
let analysisActive = false;
let analysisResults = [];
let currentAnalysisFen = '';
let analysisDepth = 20;
let analysisLines = 5;

// --- DATABASE MENU ---
let databaseActive = true; // Default to shown

function toggleDatabaseMenu() {
    databaseActive = !databaseActive;
    const section = document.getElementById('explorer-section');
    const btn = document.getElementById('btn-database');

    // Save state to settings
    userSettings.databaseOpen = databaseActive;
    localStorage.setItem('chessSettingsPro', JSON.stringify(userSettings));

    if (databaseActive) {
        section.classList.remove('hidden');
        btn.classList.add('active');
        updateOpeningExplorer();
    } else {
        section.classList.add('hidden');
        btn.classList.remove('active');
    }
}

async function toggleAnalysisMenu() {
    analysisActive = !analysisActive;
    const section = document.getElementById('analysis-section');
    const btn = document.getElementById('btn-analysis');
    const evalBar = document.getElementById('eval-bar-container');

    // Save state to settings
    userSettings.analysisOpen = analysisActive;
    localStorage.setItem('chessSettingsPro', JSON.stringify(userSettings));

    if (analysisActive) {
        section.classList.remove('hidden');
        btn.classList.add('active');
        evalBar.classList.remove('hidden');
        runStockfishAnalysis();
    } else {
        section.classList.add('hidden');
        btn.classList.remove('active');
        // Hide eval bar only if engine evaluation is not running
        if (!isEngineRunning) {
            evalBar.classList.add('hidden');
        }
        // Stop any ongoing calculation
        await stopEngineCalculation();
        // Reset MultiPV to 1 for normal evaluation
        sendEngineCommand('setoption name MultiPV value 1');
    }
}

function updateAnalysisDepth(value) {
    analysisDepth = parseInt(value);
    // Re-run analysis with new depth if active
    if (analysisActive) {
        runStockfishAnalysis();
    }
}

function updateAnalysisLines(value) {
    analysisLines = parseInt(value);
    // Clear old results and re-run analysis with new lines count if active
    if (analysisActive) {
        analysisResults = [];
        runStockfishAnalysis();
    }
}

async function runStockfishAnalysis() {
    if (!analysisActive) return;

    const container = document.getElementById('analysis-moves');
    const depthSpan = document.getElementById('analysis-depth');

    container.innerHTML = '<div class="explorer-loading"><svg class="chess-icon icon-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-9-9"/></svg> Analysiere...</div>';
    depthSpan.innerText = '';

    const fen = game.fen();
    currentAnalysisFen = fen;
    analysisResults = [];

    // Ensure engine is initialized
    await initEngine();

    // Stop any ongoing calculation before starting new analysis
    await stopEngineCalculation();

    // Configure and start analysis with MultiPV
    sendEngineCommand(\`setoption name MultiPV value \${analysisLines}\`);
    sendEngineCommand(\`position fen \${fen}\`);

    // Use selected depth (99 = infinite)
    if (analysisDepth >= 99) {
        sendEngineCommand('go infinite');
    } else {
        sendEngineCommand(\`go depth \${analysisDepth}\`);
    }
}

// Called from handleEngineMessage in stockfish-wrapper.js
function handleAnalysisMessage(line) {
    if (!analysisActive) return;

    const tokens = line.split(' ');

    const depthIdx = tokens.indexOf('depth');
    const depth = depthIdx !== -1 ? parseInt(tokens[depthIdx + 1]) : 0;

    // Only process if depth is reasonable
    if (depth < 1) return;

    const multipvIdx = tokens.indexOf('multipv');
    const multipv = multipvIdx !== -1 ? parseInt(tokens[multipvIdx + 1]) : 1;

    const scoreIdx = tokens.indexOf('score');
    let score = null;
    let isMate = false;
    if (scoreIdx !== -1) {
        const type = tokens[scoreIdx + 1];
        const value = parseInt(tokens[scoreIdx + 2]);
        if (type === 'mate') {
            score = value;
            isMate = true;
        } else if (type === 'cp') {
            score = value / 100;
        }
    }

    const pvIdx = tokens.indexOf('pv');
    const pvMoves = pvIdx !== -1 ? tokens.slice(pvIdx + 1) : [];

    if (pvMoves.length > 0) {
        // Convert UCI move to SAN
        const uciMove = pvMoves[0];
        let sanMove = uciToSan(uciMove, currentAnalysisFen);

        // Convert full PV to SAN
        let pvSan = convertPvToSan(pvMoves, currentAnalysisFen);

        // Update results for this multipv line
        analysisResults[multipv - 1] = {
            move: sanMove,
            uci: uciMove,
            score: score,
            isMate: isMate,
            depth: depth,
            pv: pvMoves.slice(0, 16),
            pvSan: pvSan
        };

        // Update display
        renderAnalysisMoves();
        if (analysisActive) {
            document.getElementById('analysis-depth').innerText = \`Tiefe \${depth}\`;
        }

        // Update eval bar with best line (multipv 1)
        if (multipv === 1 && score !== null) {
            let evalScore = score;
            // Adjust for side to move
            if (game.turn() === 'b') evalScore = -evalScore;

            if (isMate) {
                evalScore = evalScore > 0 ? 100 : -100;
                document.getElementById('eval-score').innerText = \`M\${Math.abs(score)}\`;
            } else {
                document.getElementById('eval-score').innerText = (evalScore > 0 ? '+' : '') + evalScore.toFixed(1);
                if (evalScore > 5) evalScore = 5;
                if (evalScore < -5) evalScore = -5;
            }
            updateEvalBar(evalScore);
        }
    }
}

function uciToSan(uci, fen) {
    // Create a temporary game to convert UCI to SAN
    const tempGame = new Chess(fen);
    const from = uci.substring(0, 2);
    const to = uci.substring(2, 4);
    const promotion = uci.length > 4 ? uci[4] : undefined;

    try {
        const move = tempGame.move({ from, to, promotion });
        return move ? move.san : uci;
    } catch (e) {
        return uci;
    }
}

function convertPvToSan(pvMoves, startFen) {
    const tempGame = new Chess(startFen);
    const sanMoves = [];

    for (let i = 0; i < Math.min(pvMoves.length, 16); i++) {
        const uci = pvMoves[i];
        const from = uci.substring(0, 2);
        const to = uci.substring(2, 4);
        const promotion = uci.length > 4 ? uci[4] : undefined;

        try {
            const move = tempGame.move({ from, to, promotion });
            if (move) {
                sanMoves.push(move.san);
            } else {
                break;
            }
        } catch (e) {
            break;
        }
    }

    return sanMoves;
}

function renderAnalysisMoves() {
    // Render to standard analysis section if active
    if (analysisActive) {
        renderAnalysisToContainer('analysis-moves', 'analysis-depth');
    }
}

function renderAnalysisToContainer(containerId, depthSpanId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const turn = game.turn(); // 'w' or 'b'

    if (analysisResults.length === 0) {
        container.innerHTML = '<div class="explorer-placeholder">Keine Analyse verfügbar</div>';
        return;
    }

    container.innerHTML = '';

    // Only show up to analysisLines results
    analysisResults.filter(r => r).slice(0, analysisLines).forEach((result, index) => {
        if (!result) return;

        // Adjust score for black's perspective
        let displayScore = result.score;
        if (turn === 'b' && displayScore !== null) {
            displayScore = -displayScore;
        }

        let evalText, evalClass;
        if (result.isMate) {
            evalText = displayScore > 0 ? \`M\${Math.abs(result.score)}\` : \`-M\${Math.abs(result.score)}\`;
            evalClass = displayScore > 0 ? 'positive' : 'negative';
        } else if (displayScore !== null) {
            evalText = displayScore > 0 ? \`+\${displayScore.toFixed(1)}\` : displayScore.toFixed(1);
            evalClass = displayScore > 0.3 ? 'positive' : displayScore < -0.3 ? 'negative' : 'neutral';
        } else {
            evalText = '?';
            evalClass = 'neutral';
        }

        // Build PV string (skip first move as it's already shown)
        const pvLine = result.pvSan ? result.pvSan.slice(1).join(' ') : '';

        const moveDiv = document.createElement('div');
        moveDiv.className = 'explorer-move analysis-line';
        moveDiv.onclick = () => playAnalysisMove(result.uci);

        moveDiv.innerHTML = \`
            <div class="explorer-move-san">\${result.move}</div>
            <div class="analysis-move-eval \${evalClass}">\${evalText}</div>
            <div class="analysis-pv">\${pvLine}</div>
        \`;

        container.appendChild(moveDiv);
    });
}

function playAnalysisMove(uci) {
    try {
        const from = uci.substring(0, 2);
        const to = uci.substring(2, 4);
        const promotion = uci.length > 4 ? uci[4] : undefined;

        const move = game.move({ from, to, promotion });
        if (!move) return;

        board.position(game.fen(), false);
        if (move.captured) playSound('capture');
        else playSound('move');
        highlightLastMove(move);

        currentDisplayAnnotations = {};
        updatePgnDisplay();
        loadNoteForCurrentPos();
        updateOpeningExplorer();

        // Re-run analysis for new position
        if (analysisActive) {
            runStockfishAnalysis();
        }

        if (isEngineRunning && mode !== 'bot' && mode !== 'train') {
            setTimeout(startEvaluation, 50);
        }
    } catch (e) {
        console.error('Failed to play analysis move:', e);
    }
}

// Update analysis when position changes in add mode
function updateAnalysisIfActive() {
    if (analysisActive && mode === 'add') {
        runStockfishAnalysis();
    }
}

// --- LICHESS OPENING EXPLORER ---
let explorerCache = {};

async function updateOpeningExplorer() {
    if (mode !== 'add') return;

    const fen = game.fen();
    const container = document.getElementById('explorer-moves');
    const stats = document.getElementById('explorer-stats');

    const source = document.getElementById('explorer-source-select').value === 'masters' ? 'masters' : 'lichess';
    const cacheKey = source + ':' + fen;
    // Cache each database separately.
    if (explorerCache[cacheKey]) {
        renderExplorerMoves(explorerCache[cacheKey]);
        return;
    }

    const token = document.getElementById('explorer-api-token').value.trim();
    if (!token) {
        container.textContent = 'Lichess API-Token eingeben, um die Datenbank zu laden.';
        stats.innerText = '';
        return;
    }
    // Show loading
    container.innerHTML = '<div class="explorer-loading"><svg class="chess-icon icon-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-9-9"/></svg> Lade Datenbank...</div>';
    stats.innerText = '';

    try {
        // Lichess Opening Explorer API
        const response = await fetch(\`https://explorer.lichess.org/\${source}?fen=\${encodeURIComponent(fen)}\${source === "lichess" ? "&variant=standard&speeds=blitz,rapid,classical&ratings=2000,2200,2500" : ""}\`, { headers: { Authorization: \`Bearer \${token}\` } });

        if (response.status === 401 || response.status === 403) { container.textContent = 'Lichess API-Token ungültig oder abgelaufen.'; return; }
        if (response.status === 429) { container.textContent = 'Zu viele Anfragen. Bitte später erneut versuchen.'; return; }
        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        explorerCache[cacheKey] = data;
        if (game.fen() !== fen || document.getElementById("explorer-source-select").value !== source) return;
        renderExplorerMoves(data);

    } catch (error) {
        container.innerHTML = '<div class="explorer-error"><svg class="chess-icon icon-exclamation-triangle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 10 18H2ZM12 9v5m0 3v.1"/></svg> Datenbank nicht verfügbar</div>';
        stats.innerText = '';
    }
}

function renderExplorerMoves(data) {
    const container = document.getElementById('explorer-moves');
    const stats = document.getElementById('explorer-stats');

    if (!data || !data.moves || data.moves.length === 0) {
        container.innerHTML = '<div class="explorer-placeholder">Keine Züge in der Datenbank</div>';
        stats.innerText = '';
        return;
    }

    // Total games
    const totalGames = data.white + data.draws + data.black;
    stats.innerText = \`\${totalGames.toLocaleString()} Partien\`;

    // Sort moves by popularity
    const moves = data.moves.sort((a, b) => {
        const totalA = a.white + a.draws + a.black;
        const totalB = b.white + b.draws + b.black;
        return totalB - totalA;
    });

    container.innerHTML = '';

    moves.forEach(moveData => {
        const total = moveData.white + moveData.draws + moveData.black;
        const whitePercent = (moveData.white / total) * 100;
        const drawPercent = (moveData.draws / total) * 100;
        const blackPercent = (moveData.black / total) * 100;

        const moveDiv = document.createElement('div');
        moveDiv.className = 'explorer-move';
        moveDiv.onclick = () => playExplorerMove(moveData.san);

        // Only show percentage text if segment is wide enough (>15%)
        const whiteText = whitePercent >= 15 ? \`\${Math.round(whitePercent)}%\` : '';
        const drawText = drawPercent >= 15 ? \`\${Math.round(drawPercent)}%\` : '';
        const blackText = blackPercent >= 15 ? \`\${Math.round(blackPercent)}%\` : '';

        moveDiv.innerHTML = \`
            <div class="explorer-move-san">\${moveData.san}</div>
            <div class="explorer-move-bar">
                <div class="explorer-bar-segment explorer-bar-white" style="width: \${whitePercent}%">\${whiteText}</div>
                <div class="explorer-bar-segment explorer-bar-draw" style="width: \${drawPercent}%">\${drawText}</div>
                <div class="explorer-bar-segment explorer-bar-black" style="width: \${blackPercent}%">\${blackText}</div>
            </div>
            <div class="explorer-move-stats">
                <span class="explorer-move-games">\${total.toLocaleString()}</span>
            </div>
        \`;

        container.appendChild(moveDiv);
    });
}

function playExplorerMove(san) {
    try {
        const move = game.move(san);
        if (!move) return;

        board.position(game.fen(), false);
        if (move.captured) playSound('capture');
        else playSound('move');
        highlightLastMove(move);

        currentDisplayAnnotations = {};
        updatePgnDisplay();
        loadNoteForCurrentPos();
        updateOpeningExplorer();

        if (isEngineRunning && mode !== 'bot' && mode !== 'train') {
            setTimeout(startEvaluation, 50);
        }
    } catch (e) {
        console.error('Failed to play move:', e);
    }
}

applySettings(); initBoard(); setSide('white'); window.onresize = board.resize;

document.body.addEventListener('mousedown', initAudio);
`,Kg=`
// --- STOCKFISH 17.1 ENGINE INTEGRATION ---
// Uses Web Worker approach for the single-threaded WASM build

let engine = null;
let isEngineRunning = false;
let engineInitialized = false;
let engineCalculating = false; // Track if engine is currently calculating

// --- BOT GAME VARIABLES ---
let botGameActive = false;
let botElo = 1500;
let botStyle = 'neutral'; // neutral, greedy, tactical, positional
let selectedBotLine = null;
let isBotThinking = false;
let botGameMoves = [];
let botGameEvaluations = [];
let botMultiPvMoves = []; // Store candidate moves for style selection
let botWaitingForStyleMove = false; // Track if we're waiting for MultiPV results

// Initialize Stockfish Web Worker
async function initializeStockfish() {
    if (engineInitialized) {
        return;
    }

    try {
        console.log('Creating Stockfish Web Worker...');

        // Create a Web Worker from the Stockfish JS file
        engine = new Worker('stockfish/stockfish-17.1-single-a496a04.js');

        // Set up message handler
        engine.onmessage = function(event) {
            handleEngineMessage(event.data);
        };

        engine.onerror = function(error) {
            console.error('Stockfish Worker error:', error);
        };

        engineInitialized = true;
        console.log('Stockfish Worker created successfully');

        // Send initial UCI command
        sendEngineCommand('uci');

    } catch (err) {
        console.error('Failed to initialize Stockfish:', err);
        engineInitialized = false;
    }
}

// Send UCI command to engine
function sendEngineCommand(command) {
    if (!engine) {
        console.warn('Engine not initialized');
        return;
    }

    // Track when a 'go' command starts a calculation
    if (command.startsWith('go ')) {
        engineCalculating = true;
    }

    console.log('Sending command:', command);
    engine.postMessage(command);
}

// Stop any ongoing engine calculation
// Returns a promise that resolves when the engine is ready for new commands
function stopEngineCalculation() {
    return new Promise((resolve) => {
        if (!engine) {
            resolve();
            return;
        }

        if (!engineCalculating) {
            // No calculation in progress, resolve immediately
            resolve();
            return;
        }

        // Send stop command
        console.log('Stopping ongoing calculation...');
        engine.postMessage('stop');

        // Give the engine a brief moment to process the stop command
        // This ensures messages from the old search are flushed
        eruditeNativeTimeout(() => {
            engineCalculating = false;
            resolve();
        }, 50);
    });
}

// Handle all messages from the engine
function handleEngineMessage(line) {
    if (typeof line !== 'string') return;

    // --- FIX START: Configure Engine Memory on Startup ---
    // This intercepts the 'uciok' signal to set safe memory limits immediately.
    // Without this, Stockfish 17 tries to allocate too much RAM and crashes WASM.
    if (line === 'uciok') {
        console.log('Configuring Stockfish memory...');
        sendEngineCommand('setoption name Threads value 1'); // Ensure single thread
        sendEngineCommand('setoption name Hash value 256'); // Limit to 16MB (Safe for web)
        sendEngineCommand('isready');
        return;
    }
    // --- FIX END ---

    // Track when calculation stops (bestmove signals end of calculation)
    if (line.startsWith('bestmove')) {
        engineCalculating = false;
    }

    // ANALYSIS MODE - handle MultiPV results
    if (analysisActive && line.startsWith('info') && line.includes(' pv ')) {
        handleAnalysisMessage(line);
    }

    // EVALUATION LOGIC (Only if NOT in bot mode and not in analysis)
    // Updates the evaluation bar during normal board usage
    if (!analysisActive && mode !== 'bot' && line.startsWith('info') && line.includes('score')) {
        parseEvaluation(line);
    }

    // EVALUATION TRACKING FOR BOT MODE
    // Captures evaluation history to calculate accuracy at end of game
    if (mode === 'bot' && line.startsWith('info') && line.includes('score') && line.includes('depth')) {
        const tokens = line.split(' ');
        const depthIdx = tokens.indexOf('depth');
        const depth = depthIdx !== -1 ? parseInt(tokens[depthIdx + 1]) : 0;

        // Only track evaluations at reasonable depth (>= 10) to avoid noise
        if (depth >= 10) {
            const scoreIdx = tokens.indexOf('score');
            if (scoreIdx !== -1) {
                const type = tokens[scoreIdx + 1];
                let value = parseInt(tokens[scoreIdx + 2]);

                if (type === 'mate') {
                    value = value > 0 ? 10000 : -10000;
                }

                // Adjust score for side to move so the graph/stats are consistent
                if (game.turn() === 'b') value = -value;
                botGameEvaluations.push(value);
            }
        }
    }

    // BOT STYLE - Collect MultiPV candidates
    if (mode === 'bot' && botWaitingForStyleMove && line.startsWith('info') && line.includes(' pv ')) {
        const tokens = line.split(' ');
        const multipvIdx = tokens.indexOf('multipv');
        const pvIdx = tokens.indexOf('pv');
        const scoreIdx = tokens.indexOf('score');

        if (multipvIdx !== -1 && pvIdx !== -1 && scoreIdx !== -1) {
            const pvNum = parseInt(tokens[multipvIdx + 1]);
            const move = tokens[pvIdx + 1];
            const scoreType = tokens[scoreIdx + 1];
            let scoreValue = parseInt(tokens[scoreIdx + 2]);

            if (scoreType === 'mate') {
                scoreValue = scoreValue > 0 ? 10000 : -10000;
            }

            // Store move with its info
            botMultiPvMoves[pvNum - 1] = {
                move: move,
                score: scoreValue,
                isCapture: isCaptureMove(move),
                isCheck: isCheckMove(move)
            };
        }
    }

    // BOT MOVE LOGIC
    // Detects when the bot has finished thinking and plays the move
    if (mode === 'bot' && line.startsWith('bestmove')) {
        let selectedMove;

        if (botWaitingForStyleMove && botMultiPvMoves.length > 0) {
            // Select move based on style
            selectedMove = selectMoveByStyle(botMultiPvMoves, line.split(' ')[1]);
            botWaitingForStyleMove = false;
            botMultiPvMoves = [];
        } else {
            selectedMove = line.split(' ')[1];
        }

        if (selectedMove) {
            const moveResult = game.move({
                from: selectedMove.substring(0, 2),
                to: selectedMove.substring(2, 4),
                promotion: selectedMove.length > 4 ? selectedMove[4] : 'q'
            });

            if (moveResult) {
                board.position(game.fen(), false);

                setTimeout(() => {
                    if (moveResult.captured) playSound('capture');
                    else playSound('move');
                    highlightLastMove({ from: selectedMove.substring(0, 2), to: selectedMove.substring(2, 4) });

                    setTimeout(() => {
                        isBotThinking = false;
                        updateBotStatus("Dein Zug", "neutral");

                        if (game.game_over()) {
                            setTimeout(() => {
                                showBotGameResults();
                            }, 500);
                        }
                    }, 150);
                }, 100);
            }
        }
    }
}

// Check if a UCI move is a capture (by checking if target square has a piece)
function isCaptureMove(uciMove) {
    const to = uciMove.substring(2, 4);
    const piece = game.get(to);
    return piece !== null;
}

// Check if a move gives check (simple heuristic)
function isCheckMove(uciMove) {
    // We can't easily check without making the move, so we return false
    // The engine's evaluation already considers this
    return false;
}

// Select move based on bot style from MultiPV candidates
function selectMoveByStyle(candidates, bestMove) {
    // Filter valid candidates (non-null)
    const validCandidates = candidates.filter(c => c && c.move);
    if (validCandidates.length === 0) return bestMove;

    const topScore = validCandidates[0].score;

    // Define acceptable score loss based on skill (weaker bots can deviate more)
    let maxScoreLoss;
    if (botElo < 1200) {
        maxScoreLoss = 150; // Can play moves up to 1.5 pawns worse
    } else if (botElo < 1600) {
        maxScoreLoss = 80;  // Up to 0.8 pawns worse
    } else if (botElo < 2000) {
        maxScoreLoss = 40;  // Up to 0.4 pawns worse
    } else {
        maxScoreLoss = 20;  // Only 0.2 pawns worse for strong bots
    }

    // Filter candidates within acceptable score range
    const acceptableMoves = validCandidates.filter(c =>
        (topScore - c.score) <= maxScoreLoss
    );

    if (acceptableMoves.length <= 1) {
        return acceptableMoves[0]?.move || bestMove;
    }

    switch (botStyle) {
        case 'greedy': {
            // Prefer captures, especially winning ones
            const captures = acceptableMoves.filter(c => c.isCapture);
            if (captures.length > 0) {
                // Sort by score (best capture)
                captures.sort((a, b) => b.score - a.score);
                return captures[0].move;
            }
            // No captures available, play the safest (best scored) move
            return acceptableMoves[0].move;
        }

        case 'tactical': {
            // Prefer captures and active moves, willing to sacrifice
            const captures = acceptableMoves.filter(c => c.isCapture);
            if (captures.length > 0) {
                // Pick a capture, even if slightly worse (within limits)
                return captures[Math.floor(Math.random() * Math.min(2, captures.length))].move;
            }
            // Add some randomness among top moves to create "chaos"
            const topMoves = acceptableMoves.slice(0, Math.min(3, acceptableMoves.length));
            return topMoves[Math.floor(Math.random() * topMoves.length)].move;
        }

        case 'positional': {
            // Avoid captures when possible, prefer quiet moves
            const quietMoves = acceptableMoves.filter(c => !c.isCapture);
            if (quietMoves.length > 0) {
                // Play the best quiet move
                return quietMoves[0].move;
            }
            // Must capture, play the best one
            return acceptableMoves[0].move;
        }

        default:
            // Neutral: just play the best move
            return acceptableMoves[0].move;
    }
}

// Restart engine (terminate old, create new)
function restartEngine() {
    return new Promise((resolve, reject) => {
        if (engine) {
            engine.terminate();
            engine = null;
            engineInitialized = false;
            engineCalculating = false; // Reset calculation flag
        }

        initializeStockfish()
            .then(() => {
                // Wait a bit for engine to be ready
                setTimeout(resolve, 100);
            })
            .catch(reject);
    });
}

async function initEngine() {
    if (!engineInitialized) {
        await restartEngine();
    }
}

function toggleEngine() {
    isEngineRunning = !isEngineRunning;
    updateSettingsUI();
    const bar = document.getElementById('eval-bar-container');
    if (isEngineRunning) {
        initEngine().then(startEvaluation);
        bar.classList.remove('hidden');
    } else {
        bar.classList.add('hidden');
        stopEngineCalculation();
    }
}

async function startEvaluation() {
    // If full analysis (MultiPV) is active, do not start the simple evaluation
    // as it will interrupt the analysis 'go' command and prevent results.
    if (analysisActive) {
        console.log('startEvaluation skipped because analysisActive is true');
        return;
    }

    if (!isEngineRunning || !engine) return;

    // Stop any ongoing calculation before starting new one
    await stopEngineCalculation();

    sendEngineCommand('position fen ' + game.fen());
    sendEngineCommand('go depth 15');
}

// --- BOT GAME FUNCTIONS ---
function startBotSetup(lineId) {
    const line = repertoire[currentSide].find(l => l.id === lineId);
    if (!line) return;
    selectedBotLine = line;

    // Update UI immediately
    document.getElementById('bot-line-preview').innerText = line.pgn;
    document.getElementById('elo-display').innerText = botElo;
    document.getElementById('elo-slider').value = botElo;

    switchUI('bot-setup-mode');

    // Restart engine to clear old state (in background)
    restartEngine().catch(err => {
        console.error('Engine restart failed:', err);
    });
}

function updateEloDisplay(val) {
    botElo = val;
    document.getElementById('elo-display').innerText = val;
}

function selectBotStyle(style) {
    botStyle = style;

    // Update button states
    document.querySelectorAll('.bot-style-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.style === style);
    });

    // Update description with concrete behaviors
    const descriptions = {
        'neutral': 'Ausgewogener Spielstil. Spielt den objektiv besten Zug.',
        'greedy': 'Schlägt gerne Figuren und vermeidet Abtäusche bei Materialvorteil. Nimmt selten Opfer an.',
        'tactical': 'Sucht Schachs, Angriffe und Opfer. Bevorzugt offene Linien und aktive Figuren.',
        'positional': 'Vermeidet Schlagzüge wenn möglich. Baut langsam auf und verbessert Figurenstellung.'
    };
    document.getElementById('bot-style-description').innerText = descriptions[style] || descriptions['neutral'];
}

function launchBotGame() {
    if (!selectedBotLine) return;

    const styleNames = {
        'neutral': '',
        'greedy': 'Materialist',
        'tactical': 'Taktiker',
        'positional': 'Stratege'
    };

    const startGame = () => {
        game.load_pgn(selectedBotLine.pgn);
        board.position(game.fen());
        board.orientation(currentSide);
        document.getElementById('eval-bar-container').classList.add('hidden');
        document.getElementById('bot-play-elo').innerText = \`(\${botElo})\`;
        document.getElementById('bot-play-style').innerText = styleNames[botStyle] || '';
        mode = 'bot';
        botGameActive = true;
        isBotThinking = false;
        botGameMoves = [];
        botGameEvaluations = [];
        switchUI('bot-play-mode');
        updateBotStatus("Spiel gestartet", "neutral");

        // Initial configuration for the game
        sendEngineCommand('ucinewgame');

        if (game.turn().charAt(0) !== currentSide.charAt(0)) {
            updateBotStatus("Bot zieht...", "neutral");
            isBotThinking = true;
            setTimeout(makeBotMove, 1000);
        }
    };

    // If engine is not ready, initialize it first
    if (!engine) {
        updateBotStatus("Engine wird geladen...", "neutral");
        restartEngine().then(() => {
            startGame();
        }).catch(err => {
            console.error('Engine start failed:', err);
            alert('Stockfish konnte nicht geladen werden.');
        });
    } else {
        startGame();
    }
}

async function makeBotMove() {
    if (!botGameActive || !engine) return;
    if (game.game_over()) return;

    // ELO to skill level mapping
    let skill;
    if (botElo <= 800) {
        skill = 0;
    } else if (botElo <= 1100) {
        skill = Math.floor((botElo - 800) / 75);
    } else if (botElo <= 1400) {
        skill = Math.floor(4 + (botElo - 1100) / 60);
    } else if (botElo <= 1700) {
        skill = Math.floor(9 + (botElo - 1400) / 50);
    } else if (botElo <= 2200) {
        skill = Math.floor(15 + (botElo - 1700) / 125);
    } else {
        skill = 20;
    }

    const clampedSkill = Math.max(0, Math.min(20, skill));

    // Adjust move time based on strength
    let moveTime;
    if (botElo < 1000) {
        moveTime = 50;
    } else if (botElo < 1500) {
        moveTime = 100;
    } else if (botElo < 2000) {
        moveTime = 200;
    } else if (botElo < 2200) {
        moveTime = 300;
    } else if (botElo < 2500) {
        moveTime = 500;
    } else {
        moveTime = 800;
    }

    // Stop any ongoing calculation before starting bot move calculation
    await stopEngineCalculation();

    sendEngineCommand(\`setoption name Skill Level value \${clampedSkill}\`);

    // Add UCI Elo option for better strength calibration
    if (botElo <= 2800) {
        sendEngineCommand(\`setoption name UCI_LimitStrength value true\`);
        sendEngineCommand(\`setoption name UCI_Elo value \${botElo}\`);
    } else {
        sendEngineCommand(\`setoption name UCI_LimitStrength value false\`);
    }

    // Apply style-specific UCI options
    switch (botStyle) {
        case 'greedy':
            sendEngineCommand('setoption name Contempt value 50');
            break;
        case 'tactical':
            sendEngineCommand('setoption name Contempt value -30');
            break;
        case 'positional':
            sendEngineCommand('setoption name Contempt value 20');
            break;
        default:
            sendEngineCommand('setoption name Contempt value 0');
    }

    sendEngineCommand('position fen ' + game.fen());

    // For non-neutral styles, use MultiPV to get candidate moves for style-based selection
    if (botStyle !== 'neutral') {
        botMultiPvMoves = [];
        botWaitingForStyleMove = true;
        sendEngineCommand('setoption name MultiPV value 5');
        sendEngineCommand(\`go movetime \${moveTime}\`);
    } else {
        // Neutral style: just play the engine's best move
        botWaitingForStyleMove = false;
        sendEngineCommand('setoption name MultiPV value 1');
        sendEngineCommand(\`go movetime \${moveTime}\`);
    }
}

function updateBotStatus(msg, type) {
    const el = document.getElementById('bot-status');
    el.innerText = msg;
    el.className = \`status-badge \${type}\`;
}

function stopBotGame() {
    // If game is still active, show results as draw
    if (botGameActive && !game.game_over()) {
        showBotGameResults(true);
        return;
    }

    botGameActive = false;
    isBotThinking = false;
    mode = 'view';
    if (isEngineRunning) document.getElementById('eval-bar-container').classList.remove('hidden');
    switchUI('view-mode');
    resetBoardSearch();
}

function parseEvaluation(line) {
    const tokens = line.split(' ');
    let scoreIdx = tokens.indexOf('score');
    if (scoreIdx !== -1) {
        let type = tokens[scoreIdx + 1];
        let value = parseInt(tokens[scoreIdx + 2]);
        if (game.turn() === 'b') value = -value;

        let score = 0;
        if (type === 'mate') {
            score = (value > 0) ? 100 : -100;
            document.getElementById('eval-score').innerText = \`M\${Math.abs(value)}\`;
        } else {
            score = value / 100;
            document.getElementById('eval-score').innerText = (score > 0 ? '+' : '') + score.toFixed(1);
            if (score > 5) score = 5;
            if (score < -5) score = -5;
        }
        updateEvalBar(score);
    }
}

function updateEvalBar(score) {
    let percent = 50;
    if (score === 100) percent = 100;
    else if (score === -100) percent = 0;
    else percent = 50 + (score * 10);
    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;

    const fill = document.getElementById('eval-fill');
    const text = document.getElementById('eval-score');
    fill.style.height = percent + '%';

    if (score >= 0) {
        text.style.top = 'auto';
        text.style.bottom = '5px';
        text.style.color = '#333';
    } else {
        text.style.top = '5px';
        text.style.bottom = 'auto';
        text.style.color = '#f8fafc';
    }
}

// --- BOT GAME RESULTS ---
function calculateAccuracy(evaluations, isPlayerWhite) {
    if (evaluations.length < 2) return 95;

    let totalLoss = 0;
    let moveCount = 0;

    for (let i = 1; i < evaluations.length; i++) {
        const prevEval = evaluations[i - 1];
        const currEval = evaluations[i];

        let loss = 0;
        if (isPlayerWhite) {
            loss = Math.max(0, prevEval - currEval);
        } else {
            loss = Math.max(0, currEval - prevEval);
        }

        totalLoss += loss;
        moveCount++;
    }

    if (moveCount === 0) return 95;

    const avgLoss = totalLoss / moveCount;
    let accuracy = 100 * Math.exp(-avgLoss / 150);
    accuracy = Math.max(0, Math.min(100, accuracy));

    return Math.round(accuracy);
}

function showBotGameResults(manualStop = false) {
    const overlay = document.getElementById('bot-results-overlay');
    const icon = document.getElementById('bot-results-icon');
    const title = document.getElementById('bot-results-title');
    const subtitle = document.getElementById('bot-results-subtitle');

    let iconClass = '';
    let iconHtml = '';

    if (manualStop) {
        title.innerText = 'Spiel unterbrochen';
        subtitle.innerText = 'Du hast das Spiel beendet';
        iconClass = 'good';
        iconHtml = '<svg class="chess-icon icon-handshake" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9 5-5 5 1 4-1 5 5-9 11-4-2-6-9ZM8 4l-5 5M13 5l-5 7 3 2 6-6"/></svg>';
    } else if (game.in_checkmate()) {
        if (game.turn() === 'w') {
            if (currentSide === 'black') {
                title.innerText = 'Du hast gewonnen!';
                subtitle.innerText = 'Schachmatt! Hervorragend gespielt!';
                iconClass = 'perfect';
                iconHtml = '<svg class="chess-icon icon-trophy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3h8v7c0 6-8 6-8 0ZM8 5H3v4c0 4 5 4 5 4M16 5h5v4c0 4-5 4-5 4M12 14v6M7 21h10"/></svg>';
            } else {
                title.innerText = 'Bot hat gewonnen';
                subtitle.innerText = 'Schachmatt! Versuch es nochmal!';
                iconClass = 'needs-work';
                iconHtml = '<svg class="chess-icon icon-robot" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16v14H4ZM12 2v4M8 11h1m6 0h1M8 16h8M1 10v6m22-6v6"/></svg>';
            }
        } else {
            if (currentSide === 'white') {
                title.innerText = 'Du hast gewonnen!';
                subtitle.innerText = 'Schachmatt! Hervorragend gespielt!';
                iconClass = 'perfect';
                iconHtml = '<svg class="chess-icon icon-trophy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3h8v7c0 6-8 6-8 0ZM8 5H3v4c0 4 5 4 5 4M16 5h5v4c0 4-5 4-5 4M12 14v6M7 21h10"/></svg>';
            } else {
                title.innerText = 'Bot hat gewonnen';
                subtitle.innerText = 'Schachmatt! Versuch es nochmal!';
                iconClass = 'needs-work';
                iconHtml = '<svg class="chess-icon icon-robot" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16v14H4ZM12 2v4M8 11h1m6 0h1M8 16h8M1 10v6m22-6v6"/></svg>';
            }
        }
    } else if (game.in_draw() || game.in_stalemate() || game.in_threefold_repetition()) {
        title.innerText = 'Remis!';
        subtitle.innerText = 'Das Spiel endet unentschieden';
        iconClass = 'good';
        iconHtml = '<svg class="chess-icon icon-handshake" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9 5-5 5 1 4-1 5 5-9 11-4-2-6-9ZM8 4l-5 5M13 5l-5 7 3 2 6-6"/></svg>';
    } else {
        title.innerText = 'Spiel beendet';
        subtitle.innerText = '';
        iconClass = 'good';
        iconHtml = '<svg class="chess-icon icon-flag-checkered" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22V3h16v12H4M9 3v12M15 3v12M4 9h16"/></svg>';
    }

    icon.className = \`results-icon \${iconClass}\`;
    icon.innerHTML = iconHtml;

    const isPlayerWhite = currentSide === 'white';
    const playerAccuracy = calculateAccuracy(botGameEvaluations, isPlayerWhite);
    const botAccuracy = calculateAccuracy(botGameEvaluations, !isPlayerWhite);

    document.getElementById('player-accuracy').innerText = playerAccuracy + '%';
    document.getElementById('bot-accuracy').innerText = botAccuracy + '%';

    overlay.style.display = 'flex';
}

function closeBotResults() {
    document.getElementById('bot-results-overlay').style.display = 'none';
    botGameActive = false;
    isBotThinking = false;
    mode = 'view';
    if (isEngineRunning) document.getElementById('eval-bar-container').classList.remove('hidden');
    switchUI('view-mode');
    resetBoardSearch();
}
`,Jg=`// Host bridge; repertoire parsing, validation and training remain upstream.
let eruditeResumeSearch = false;
let eruditeDesiredActive = false;
let eruditeStopPromise = Promise.resolve();
const eruditeSendCommand = sendEngineCommand;
sendEngineCommand = function(command) {
    if (!eruditeActive && command.startsWith('go ')) return;
    eruditeSendCommand(command);
};
const eruditeHandleMessage = handleEngineMessage;
handleEngineMessage = function(line) {
    // Stopping a search must not play a move in a hidden bot game.
    if (!eruditeActive && typeof line === 'string' && /^(bestmove|info)/.test(line)) return;
    eruditeHandleMessage(line);
};
async function eruditeSetActive(active) {
    eruditeDesiredActive = active;
    if (active === eruditeActive) return;
    if (!active) {
        eruditeResumeSearch = engineCalculating;
        // Stop immediately; callbacks are frozen below, including the upstream stop delay.
        eruditeStopPromise = stopEngineCalculation();
        engineCalculating = false;
        eruditeSetTimersActive(false);
        audioCtx.suspend();
        return;
    }
    await eruditeStopPromise;
    if (!eruditeDesiredActive) return;
    eruditeSetTimersActive(true);
    board.resize();
    drawShapes();
    if (!engineInitialized) initializeStockfish();
    if (eruditeResumeSearch) {
        eruditeResumeSearch = false;
        if (mode === 'bot' && botGameActive && game.turn() !== currentSide.charAt(0)) makeBotMove();
        else if (analysisActive) runStockfishAnalysis();
        else if (isEngineRunning) startEvaluation();
    }
}
window.addEventListener('message', event => {
    if (event.source !== window.parent || event.data?.type !== 'erudite-chess-state') return;
    const {active, theme} = event.data;
    if (theme === 'dark' || theme === 'light') {
        userSettings.theme = theme;
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.body.classList.toggle('light-mode', theme === 'light');
        updateSettingsUI();
    }
    eruditeSetActive(active === true);
});
window.addEventListener('pagehide', () => { if (engine) engine.terminate(); });
new ResizeObserver(() => { if (eruditeActive && board) { board.resize(); drawShapes(); } }).observe(document.getElementById('board-area'));
window.parent.postMessage({type: 'erudite-chess-ready'}, '*');

function exportRepertoirePgn() {
    const games = [];
    for (const side of ['white', 'black']) {
        for (const line of repertoire[side]) {
            const parsed = new Chess();
            if (!parsed.load_pgn(line.pgn)) continue;
            parsed.header('Event', line.category || 'Repertoire', 'Orientation', side);
            games.push(parsed.pgn());
        }
    }
    const url = URL.createObjectURL(new Blob([games.join('\\n\\n')], {type: 'application/x-chess-pgn'}));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'erudite-repertoire.pgn';
    anchor.click();
    eruditeNativeTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Draw the engine suggestion separately from saved repertoire annotations.
const eruditeDrawShapes = drawShapes;
drawShapes = function() {
    eruditeDrawShapes();
    const suggestion = analysisResults[0]?.uci;
    if (analysisActive && mode === 'add' && currentAnalysisFen === game.fen() && /^[a-h][1-8][a-h][1-8]/.test(suggestion || '')) {
        drawArrow(suggestion.slice(0, 2), suggestion.slice(2, 4), 'blue');
        svgOverlay.lastElementChild?.setAttribute('data-engine-suggestion', 'true');
    }
};
const eruditeHandleAnalysis = handleAnalysisMessage;
handleAnalysisMessage = function(line) {
    eruditeHandleAnalysis(line);
    drawShapes();
};
const eruditeToggleAnalysis = toggleAnalysisMenu;
toggleAnalysisMenu = async function() {
    await eruditeToggleAnalysis();
    drawShapes();
};
`,$g=`// Preserve pending procedural callbacks and their remaining delays while hidden.
const eruditeNativeTimeout = window.setTimeout.bind(window);
const eruditeNativeClearTimeout = window.clearTimeout.bind(window);
const eruditeTimers = new Map();
let eruditeTimerId = 0;
let eruditeActive = false;
function eruditeArmTimer(timer) {
    timer.started = performance.now();
    timer.native = eruditeNativeTimeout(() => {
        eruditeTimers.delete(timer.id);
        if (typeof timer.callback === 'function') timer.callback(...timer.args);
    }, timer.remaining);
}
window.setTimeout = (callback, delay = 0, ...args) => {
    const timer = {id: ++eruditeTimerId, callback, remaining: Number(delay), args, native: null, started: 0};
    eruditeTimers.set(timer.id, timer);
    if (eruditeActive) eruditeArmTimer(timer);
    return timer.id;
};
window.clearTimeout = id => {
    const timer = eruditeTimers.get(id);
    if (timer) eruditeNativeClearTimeout(timer.native);
    eruditeTimers.delete(id);
};
function eruditeSetTimersActive(active) {
    if (active === eruditeActive) return;
    eruditeActive = active;
    for (const timer of eruditeTimers.values()) {
        if (active) eruditeArmTimer(timer);
        else {
            eruditeNativeClearTimeout(timer.native);
            timer.remaining = Math.max(0, timer.remaining - (performance.now() - timer.started));
        }
    }
}
`,Wg=`:root {
    /* --- THEME VARIABLES --- */
    --bg-body: #0f172a; --bg-panel: #1e293b; --bg-input: #334155; --bg-hover: #475569;
    --text-main: #f8fafc; --text-muted: #94a3b8; --border-color: #334155;
    --primary: #3b82f6; --primary-text: #ffffff; --danger: #ef4444; --success: #22c55e;
    --warning: #f59e0b;
    --radius: 12px; --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --resizer-bg: #475569;
    --add-mode-gap: 8px; /* unified spacing for create-line (add) mode (reduced) */
}
body.light-mode {
    --bg-body: #f8fafc; --bg-panel: #ffffff; --bg-input: #f1f5f9; --bg-hover: #e2e8f0;
    --text-main: #0f172a; --text-muted: #64748b; --border-color: #e2e8f0;
    --primary: #2563eb; --resizer-bg: #cbd5e1;
}

* { box-sizing: border-box; }

body {
    font-family: 'Inter', -apple-system, sans-serif;
    background-color: var(--bg-body); color: var(--text-main);
    margin: 0; display: flex; height: 100vh; overflow: hidden;
    transition: background-color 0.4s ease;
}

input::placeholder {
  color: white;
}

textarea::placeholder {
  color: white;
}

/* --- LAYOUT --- */
.main-container { display: flex; width: 100%; max-width: 100%; margin: 0; padding: 15px; height: 100vh; align-items: stretch; }

.board-area {
    flex: 0 0 55%; min-width: 300px; display: flex; justify-content: center; align-items: center; flex-direction: column;
    padding: 10px; position: relative; z-index: 1; overflow: visible !important;
}

/* Container für Balken + Brett */
.board-wrapper {
    display: flex; gap: 10px; width: 100%; position: relative; z-index: 10;
    max-width: 85vh; max-height: 85vh; align-items: stretch; justify-content: center;
    position: relative; /* Wichtig für SVG Overlay und Eval Bar */
    aspect-ratio: 1 / 1; /* Match board's aspect ratio */
}

#board {
    width: 100%; aspect-ratio: 1/1;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    flex-shrink: 1;
    z-index: 1; /* Unter dem SVG */
    position: relative; /* For eval bar positioning */
}

/* Board uses default corners */

/* Visual feedback when shapes are cleared via keyboard */
#board.flash-clear-shapes {
    box-shadow: 0 0 0 6px rgba(245, 159, 11, 0.12), 0 20px 30px rgba(0,0,0,0.35);
    transition: box-shadow 0.18s ease;
}

/* SVG OVERLAY FÜR PFEILE */
#arrow-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; /* Klicks gehen durch */
    z-index: 1000; /* Über den Figuren */
    shape-rendering: geometricPrecision; /* Smooth anti-aliased edges */
}

/* WICHTIG: Damit Bilder immer sichtbar sind */
#board img {
    opacity: 1 !important;
    z-index: 100;
    visibility: visible !important;
}

#board img[src*="piece"] {
    opacity: 1 !important;
    visibility: visible !important;
}

/* DRAGGED PIECES ALWAYS ON TOP */
#board img.dragging {
    opacity: 1 !important;
    z-index: 10000 !important;
    position: fixed !important;
    visibility: visible !important;
}

/* --- BRETT FARBTHEMEN --- */
.board-theme-green .white-1e1d7 { background-color: #eeeed2; color: #769656; }
.board-theme-green .black-3c85d { background-color: #769656; color: #eeeed2; }
.board-theme-brown .white-1e1d7 { background-color: #f0d9b5; color: #b58863; }
.board-theme-brown .black-3c85d { background-color: #b58863; color: #f0d9b5; }
.board-theme-blue .white-1e1d7 { background-color: #dee3e6; color: #8ca2ad; }
.board-theme-blue .black-3c85d { background-color: #8ca2ad; color: #dee3e6; }
.board-theme-gray .white-1e1d7 { background-color: #e0e0e0; color: #707070; }
.board-theme-gray .black-3c85d { background-color: #707070; color: #e0e0e0; }
.board-theme-purple .white-1e1d7 { background-color: #e9d5ff; color: #8b5cf6; }
.board-theme-purple .black-3c85d { background-color: #8b5cf6; color: #e9d5ff; }
.board-theme-teal .white-1e1d7 { background-color: #ccfbf1; color: #0d9488; }
.board-theme-teal .black-3c85d { background-color: #0d9488; color: #ccfbf1; }

/* ROUNDED BOARD CORNERS */
.board-rounded { border-radius: 8px; overflow: hidden; }
.board-rounded .square-55d63 { /* All squares default */ }
/* Target corner squares by position using nth-child */
.board-rounded [data-square="a8"] { border-top-left-radius: 8px; }
.board-rounded [data-square="h8"] { border-top-right-radius: 8px; }
.board-rounded [data-square="a1"] { border-bottom-left-radius: 8px; }
.board-rounded [data-square="h1"] { border-bottom-right-radius: 8px; }

/* STOCKFISH EVAL BAR */
#eval-bar-container {
    width: 30px; background: #333;
    border-radius: 4px; overflow: hidden; position: absolute;
    left: -40px; top: 0;
    height: 100%;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
    transition: opacity 0.3s;
    display: flex; flex-direction: column; justify-content: flex-end;
    border: 1px solid var(--border-color);
}
#eval-fill {
    width: 100%; height: 50%;
    background: #fff;
    transition: height 0.5s ease-in-out;
}
#eval-score {
    position: absolute;
    width: 100%; text-align: center;
    font-size: 11px; font-weight: 800;
    z-index: 2; pointer-events: none; line-height: 1; padding: 4px 0;
    font-family: monospace;
}

.highlight-square { box-shadow: inset 0 0 0 4px var(--highlight-last); }

/* Drag highlighting */
#board .drag-source {
    box-shadow: inset 0 0 0 100px rgba(0, 0, 0, 0.15) !important;
}
#board .drag-hover {
    box-shadow: inset 0 0 0 100px rgba(0, 0, 0, 0.15) !important;
}

/* Disable chessboard.js default hover highlighting during drag */
#board.is-dragging .highlight1-32417:not(.drag-source):not(.drag-hover),
#board.is-dragging .highlight2-9c5d2:not(.drag-source):not(.drag-hover) {
    box-shadow: none !important;
}

.resizer {
    width: 12px; cursor: col-resize; background-color: transparent; display: flex; justify-content: center; align-items: center;
    transition: background-color 0.2s; margin: 0 4px; border-radius: 6px; flex-shrink: 0; z-index: 10;
}
.resizer::after { content: ""; width: 4px; height: 40px; background-color: var(--resizer-bg); border-radius: 2px; transition: height 0.2s, background-color 0.2s; }
.resizer:hover, .resizer.dragging { background-color: var(--bg-hover); }
.resizer:hover::after, .resizer.dragging::after { height: 100%; background-color: var(--primary); }

.controls-area {
    flex: 1; min-width: 350px; background-color: var(--bg-panel); border-radius: var(--radius);
    box-shadow: var(--shadow); display: flex; flex-direction: column; height: 100%; overflow: hidden;
}
.header-row {
    display: flex; justify-content: space-between; align-items: center; padding: 20px 25px; border-bottom: 1px solid var(--border-color); flex-shrink: 0;
}
h2 { margin: 0; font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 10px; color: var(--text-main); letter-spacing: -0.5px; }
h2 .chess-icon { color: var(--primary); }
.settings-btn { background: none; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer; transition: 0.3s; }
.settings-btn:hover { color: var(--text-main); transform: rotate(90deg); }

#view-mode, #settings-mode, #add-mode, #selection-mode, #train-mode, #bot-setup-mode, #bot-play-mode, #import-pgn-mode { display: flex; flex-direction: column; height: 100%; overflow: hidden; padding: 25px; }
.scrollable-list, .settings-container, #selection-list { flex-grow: 1; overflow-y: auto; min-height: 0; padding-right: 8px; margin-bottom: 20px; }

.action-group { margin-top: auto; flex-shrink: 0; display: flex; gap: 12px; flex-wrap: wrap; }
.action-group { justify-content: center; }

/* TRAINING UI */
.training-dashboard { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; padding-bottom: 20px; width: 100%; }
.training-card { background: var(--bg-input); border-radius: var(--radius); padding: 18px; width: 100%; text-align: center; box-shadow: var(--shadow); border: 1px solid var(--border-color); }
/* Center training card on larger screens */
#train-mode .training-dashboard { justify-content: center; align-items: center; }
#train-mode .training-card { max-width: 520px; margin: 0 auto; }
/* Ensure the training card fits inside the menu area and doesn't force page scrolling */
#train-mode { overflow: hidden; }
#train-mode .training-dashboard { justify-content: flex-start; align-items: stretch; overflow: auto; padding-bottom: 12px; }
#train-mode .training-card { max-height: calc(100% - 20px); overflow-y: auto; box-sizing: border-box; }
.category-label { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 10px; font-weight: 600; }
.active-category-title { font-size: 1.4rem; font-weight: 700; color: var(--text-main); margin: 0 0 20px 0; }
.progress-container { width: 100%; height: 6px; background: var(--bg-panel); border-radius: 4px; overflow: hidden; margin-bottom: 18px; }
.progress-fill { height: 100%; background: var(--primary); width: 0%; transition: width 0.5s ease; }
.progress-text { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 5px; display: flex; justify-content: space-between; }

.status-badge { display: inline-block; padding: 10px 20px; border-radius: 30px; font-size: 1.15rem; font-weight: 800; background: var(--bg-panel); color: var(--text-main); border: 2px solid var(--border-color); transition: all 0.3s; }
.status-badge.success { background: rgba(34, 197, 94, 0.2); color: var(--success); border-color: var(--success); }
.status-badge.error { background: rgba(239, 68, 68, 0.2); color: var(--danger); border-color: var(--danger); animation: shake 0.4s; }
.status-badge.neutral { background: var(--bg-input); color: var(--primary); border-color: var(--primary); }
@keyframes shake { 10%, 90% { transform: translate3d(-2px, 0, 0); } 20%, 80% { transform: translate3d(4px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-6px, 0, 0); } 40%, 60% { transform: translate3d(6px, 0, 0); } }

.training-note {
    background: var(--bg-panel); border-left: 6px solid var(--primary);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
    padding: 20px; margin-top: 25px; border-radius: var(--radius);
    color: var(--text-main); width: 100%; max-width: 800px;
    display: none; font-size: 1.1rem; line-height: 1.6;
    flex-direction: column; gap: 15px; position: relative; z-index: 10;
}
.note-content { display: flex; align-items: flex-start; gap: 15px; }
.note-content .chess-icon { color: var(--primary); margin-top: 4px; font-size: 1.3rem; }
#note-text { flex: 1; }
.continue-btn { align-self: flex-end; background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: var(--radius); font-weight: 600; cursor: pointer; font-size: 0.95rem; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
.continue-btn:hover { background: #2563eb; transform: translateY(-1px); }

/* LISTS */
.category-group { margin-bottom: 8px; }
.category-header { font-size: 0.9rem; font-weight: 600; color: var(--text-main); margin-bottom: 2px; display: flex; align-items: center; justify-content: space-between; padding: 12px 10px; border-radius: var(--radius); cursor: pointer; transition: background 0.2s; }
.category-header:hover { background: var(--bg-hover); }
.category-header .icon-chevron-right { color: var(--text-muted); font-size: 0.8rem; margin-right: 12px; transition: transform 0.2s; }
.category-header.expanded .icon-chevron-right { transform: rotate(90deg); color: var(--text-main); }
.category-header.special-cat { border-left: 4px solid var(--warning); background: rgba(245, 158, 11, 0.1); }
.category-header.special-cat span { color: var(--warning); }
.category-content { display: none; padding-left: 12px; margin-top: 2px; }
.category-content.expanded { display: block; animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.line-item { background: transparent; padding: 12px; border-radius: var(--radius); cursor: pointer; display: flex; justify-content: space-between; align-items: flex-start; font-size: 0.95rem; transition: all 0.2s ease; margin-bottom: 2px; }
.line-item:hover { background: var(--bg-input); }
.line-item.in-repetition { background: rgba(245, 158, 11, 0.08); }

.line-item > span:first-child {
    flex: 1 1 auto; min-width: 0;
    white-space: normal; word-break: break-word; line-height: 1.5;
    padding-right: 10px;
}
.line-actions { flex: 0 0 auto; display: flex; gap: 5px; opacity: 0; transition: 0.2s; }

/* View mode move spans for context menu */
.view-move {
    cursor: pointer;
    padding: 1px 2px;
    border-radius: 3px;
    transition: background 0.15s;
}
.view-move:hover {
    background: var(--bg-hover);
    color: var(--primary);
}
.view-move-num {
    color: var(--text-muted);
    font-size: 0.85em;
    margin-right: 1px;
}
.line-moves {
    display: inline;
}

.line-item input[type="checkbox"] { accent-color: var(--primary); transform: scale(1.3); margin-right: 15px; cursor: pointer; margin-top: 3px; flex-shrink: 0; }

.cat-actions { opacity: 0; transition: opacity 0.2s ease; display: flex; gap: 5px; flex-shrink: 0; }
.category-header:hover .cat-actions, .line-item:hover .line-actions { opacity: 1; }
@media (hover: none) { .cat-actions, .line-actions { opacity: 1; } }
.cat-actions button, .line-actions button { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 6px; border-radius: 4px; font-size: 0.9rem; transition: 0.2s; }
.cat-actions button:hover, .line-actions button:hover { color: var(--primary); background: var(--bg-input); }
.cat-actions button.del:hover, .line-actions button.del:hover { color: var(--danger); }
.line-actions button.toggle-rep:hover { color: var(--warning); }
.line-actions button:has(.icon-robot):hover { color: var(--success) !important; }

/* BUTTONS & INPUTS */
.action-btn { background-color: var(--text-main); color: var(--bg-body); border: none; padding: 14px 24px; border-radius: var(--radius); font-weight: 700; cursor: pointer; flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; font-size: 1rem; }
.action-btn:hover { opacity: 0.9; transform: translateY(-1px); }
.action-btn.secondary { background-color: var(--bg-input); color: var(--text-main); }
.action-btn.secondary:hover { background-color: var(--bg-hover); }

.action-btn.repetition { background-color: transparent; border: 2px solid var(--warning); color: var(--warning); width: 100%; flex: 1 1 100%; order: -1; opacity: 0.8; }
.action-btn.repetition:hover, .action-btn.repetition:active { opacity: 1; background: var(--warning); color: #000; }

.action-btn.remove-repetition { background-color: transparent; border: 2px solid var(--success); color: var(--success); width: 100%; flex: 1 1 100%; order: -1; }
.action-btn.remove-repetition:hover { background: var(--success); color: #fff; }

input[type="text"], input[type="search"], textarea.note-input { width: 100%; padding: 14px; margin-bottom: 12px; background: var(--bg-input); border: 2px solid transparent; color: var(--text-main); border-radius: var(--radius); font-size: 1rem; transition: 0.2s; flex-shrink: 0; font-family: inherit; }
input:focus, textarea:focus { outline: none; background: var(--bg-panel); border-color: var(--primary); }
textarea.note-input { height: 100px; resize: none; margin-top: 5px; }

/* SLIDER STYLE */
input[type="range"] { appearance: none; -webkit-appearance: none; width: 100%; background: transparent; margin: 15px 0; }
input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; height: 24px; width: 24px; border-radius: 50%; background: var(--primary); cursor: pointer; margin-top: -8px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
input[type="range"]::-webkit-slider-runnable-track { width: 100%; height: 8px; cursor: pointer; background: var(--bg-input); border-radius: 4px; }

.settings-section { margin-bottom: 30px; }
.settings-label { display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 12px; color: var(--text-muted); }
.options-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.options-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.option-card { background: var(--bg-input); border: 2px solid transparent; padding: 15px; border-radius: var(--radius); cursor: pointer; text-align: center; font-size: 0.85rem; font-weight: 500; color: var(--text-main); transition: 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
.option-card:hover { background: var(--bg-hover); } .option-card.selected { border-color: var(--primary); color: var(--primary); background: var(--bg-panel); }
.option-card .chess-icon { font-size: 1rem; }

/* Editor Order List */
.order-list { display: flex; flex-direction: column; gap: 8px; }
.order-item { display: flex; align-items: center; gap: 12px; background: var(--bg-input); padding: 12px 15px; border-radius: var(--radius); }
.order-item .icon-grip-lines { color: var(--text-muted); font-size: 0.9rem; }
.order-item span { flex: 1; font-size: 0.9rem; font-weight: 500; }
.order-arrows { display: flex; gap: 4px; }
.order-arrows button { background: var(--bg-panel); border: none; color: var(--text-muted); width: 28px; height: 28px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
.order-arrows button:hover { background: var(--bg-hover); color: var(--text-main); }
.order-arrows button:active { transform: scale(0.95); }

.toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-color); cursor: pointer; }
.toggle-switch { width: 44px; height: 24px; background: var(--bg-input); border-radius: 12px; position: relative; transition: 0.3s; }
.toggle-switch::after { content: ''; position: absolute; left: 2px; top: 2px; width: 20px; height: 20px; background: #fff; border-radius: 50%; transition: 0.3s; }
.toggle-row.active .toggle-switch { background: var(--primary); } .toggle-row.active .toggle-switch::after { left: 22px; }
.color-dot { width: 20px; height: 20px; border-radius: 50%; display: inline-block; }
.view-mode-header { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: var(--add-mode-gap); flex-shrink: 0; }
.view-mode-header .color-switch { margin-bottom: 0; flex: 1; }
.view-mode-header .analyze-btn {
    padding: 10px 12px;
    background: var(--bg-input);
    border: none;
    border-radius: 8px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}
.view-mode-header .analyze-btn:hover,
.view-mode-header .analyze-btn.active {
    background: var(--primary);
    color: var(--primary-text);
}
.color-switch { display: flex; background: var(--bg-input); border-radius: var(--radius); padding: 4px; margin-bottom: var(--add-mode-gap); flex-shrink: 0; }
.color-btn { flex: 1; background: transparent; border: none; color: var(--text-muted); padding: 10px; cursor: pointer; font-weight: 600; border-radius: 6px; font-size: 0.95rem; }
.color-btn.active { background-color: var(--bg-panel); color: var(--text-main); box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.search-banner { background: var(--bg-input); padding: 12px 15px; border-radius: var(--radius); margin-bottom: var(--add-mode-gap); display: flex; justify-content: space-between; align-items: center; color: var(--text-main); font-size: 0.95rem; flex-shrink: 0;}
.search-banner button { background: none; border: none; color: var(--text-muted); font-weight: 600; cursor: pointer; }
.search-banner button:hover { color: var(--danger); }
::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: var(--bg-input); border-radius: 4px; } ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
.hidden { display: none !important; }

        /* TRAINING RESULTS OVERLAY */
.training-results-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    z-index: 10000;
    display: none;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.4s ease;
}

.results-card {
    background: var(--bg-panel);
    border-radius: var(--radius);
    padding: 40px;
    max-width: 600px;
    width: 90%;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--border-color);
    animation: slideUp 0.5s ease;
}

@keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.results-header {
    text-align: center;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 140px; /* keep title/subtitle visually centered in the card */
}

.results-icon {
    font-size: 4rem;
    margin-bottom: 20px;
}

.results-icon.perfect { color: var(--success); }
.results-icon.good { color: var(--primary); }
.results-icon.needs-work { color: var(--warning); }

.results-title {
    font-size: 2rem;
    font-weight: 800;
    margin: 0 0 10px 0;
    color: var(--text-main);
}

.results-subtitle {
    font-size: 1rem;
    color: var(--text-muted);
    margin: 0;
}

.results-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-bottom: 30px;
    justify-items: center;
}

/* Two column layout for bot game results */
#bot-results-overlay .results-stats {
    grid-template-columns: repeat(2, 1fr);
    max-width: 500px;
    margin: 0 auto 30px auto;
}

.stat-box {
    background: var(--bg-input);
    padding: 20px;
    border-radius: var(--radius);
    text-align: center;
    border: 2px solid transparent;
    transition: all 0.3s;
}

.stat-box:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
}

.stat-value {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0;
    line-height: 1;
}

.stat-value.success-color { color: var(--success); }
.stat-value.danger-color { color: var(--danger); }
.stat-value.primary-color { color: var(--primary); }

.stat-label {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-top: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.wrong-lines-section {
    background: var(--bg-input);
    border-radius: var(--radius);
    padding: 20px;
    margin-bottom: 25px;
    border-left: 4px solid var(--warning);
}

.wrong-lines-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    color: var(--warning);
    font-weight: 700;
    font-size: 1.1rem;
}

.wrong-lines-list {
    max-height: 200px;
    overflow-y: auto;
    padding-right: 10px;
}

.wrong-line-item {
    background: var(--bg-panel);
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 8px;
    font-size: 0.9rem;
    color: var(--text-main);
    border: 1px solid var(--border-color);
}

.results-question {
    text-align: center;
    font-size: 1.1rem;
    color: var(--text-main);
    margin-bottom: 20px;
    font-weight: 600;
}

.results-actions {
    display: flex;
    gap: 12px;
}

.results-btn {
    flex: 1;
    padding: 16px 24px;
    border: none;
    border-radius: var(--radius);
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.results-btn.primary {
    background: var(--warning);
    color: #000;
}

.results-btn.primary:hover {
    background: #d97706;
    transform: translateY(-2px);
}

.results-btn.secondary {
    background: var(--bg-input);
    color: var(--text-main);
}

.results-btn.secondary:hover {
    background: var(--bg-hover);
    transform: translateY(-2px);
}

.no-wrong-lines {
    text-align: center;
    padding: 30px;
}

.no-wrong-lines .chess-icon {
    font-size: 3rem;
    color: var(--success);
    margin-bottom: 15px;
}

.no-wrong-lines p {
    font-size: 1.2rem;
    color: var(--text-main);
    margin: 0 0 10px 0;
    font-weight: 600;
}

.no-wrong-lines span {
    color: var(--text-muted);
    font-size: 0.95rem;
}

/* Mobile board toggle button - hidden on desktop */
.mobile-board-toggle {
    display: none;
}

/* Mobile layout: board on top, menu below, avoid page scroll */
@media (max-width: 768px) {
    body { overflow: hidden; }
    .main-container { flex-direction: column; padding: 8px; height: 100vh; }

    /* Hide board by default on mobile in view mode */
    .board-area {
        flex: 0 0 0;
        min-width: 100%;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 6px;
        order: 0;
        overflow: hidden;
        transition: flex-basis 0.3s ease, opacity 0.3s ease;
    }

    /* Show board when toggled */
    .board-area.mobile-visible {
        display: flex;
        flex: 0 0 45vh;
    }

    .board-wrapper {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: 100%;
        align-items: center;
        justify-content: center;
        position: relative;
        margin: 0 auto;
    }

    /* Mobile eval bar positioning - inside the visible area */
    #eval-bar-container {
        left: -33px;
        width: 28px;
        overflow: visible;
    }

    #eval-score {
        font-size: 10px;
        white-space: nowrap;
    }

    #board {
        /* Keep the board square but constrained to its container */
        width: auto;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        aspect-ratio: 1 / 1;
        box-sizing: border-box;
    }

    .resizer { display: none; }

    .controls-area {
        flex: 1 1 auto;
        min-width: 100%;
        order: 1;
        height: 100%;
        padding: 12px;
        padding-bottom: calc(70px + env(safe-area-inset-bottom));
        overflow: auto;
    }

    /* When board is visible, adjust controls area */
    .board-area.mobile-visible ~ .controls-area {
        height: calc(100vh - 45vh - 16px);
    }

    /* Mobile board toggle button */
    .mobile-board-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: var(--bg-input);
        border: none;
        border-radius: 8px;
        color: var(--text-muted);
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
    }

    .mobile-board-toggle:hover,
    .mobile-board-toggle.active {
        background: var(--primary);
        color: var(--primary-text);
    }

    .mobile-board-toggle .chess-icon {
        font-size: 1rem;
    }

    /* Hide analyze button when board is hidden on mobile */
    .view-mode-header .analyze-btn {
        display: none;
    }

    /* Show analyze button when board is visible */
    .board-area.mobile-visible ~ .controls-area .view-mode-header .analyze-btn {
        display: flex;
        padding: 8px 10px;
        width: 40px;
        height: 40px;
    }

    /* Compact view-mode header */
    .view-mode-header,
    .selection-mode-header {
        gap: 8px;
        margin-bottom: 8px;
    }

    .view-mode-header .color-switch,
    .selection-mode-header .color-switch {
        padding: 3px;
    }

    .color-btn {
        padding: 8px 12px;
        font-size: 0.85rem;
    }

    /* Make key UI elements more compact on small screens */
    .training-card { padding: 16px; }
    .header-row { padding: 10px 14px; }
    h2 { font-size: 1rem; }
    .action-group { gap: 6px; }

    /* Compact action buttons */
    .action-btn {
        padding: 10px 14px;
        font-size: 0.85rem;
        gap: 6px;
    }

    /* Ensure overlays scale on mobile */
    .training-results-overlay .results-card { max-width: 95%; padding: 20px; }

    /* Make lists inside controls scroll independently and only when needed */
    .controls-area .scrollable-list,
    #lines-list,
    #selection-list,
    .settings-container {
        max-height: calc(100vh - 160px);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 60px; /* Space for absolute positioned buttons */
    }

    /* When board is visible, reduce list height */
    .board-area.mobile-visible ~ .controls-area .scrollable-list,
    .board-area.mobile-visible ~ .controls-area #lines-list,
    .board-area.mobile-visible ~ .controls-area #selection-list {
        max-height: calc(55vh - 140px);
    }

    /* Hide the clear-shapes button when creating a new line on phones */
    #add-mode .clear-shapes-btn { display: none; }

    /* Show mobile arrow drawing button on small screens */
    .arrow-btn-wrapper {
        display: flex !important;
        position: relative;
    }
    .arrow-btn-wrapper .mobile-arrow-btn {
        display: flex !important;
        padding: 8px 10px;
    }
    /* Enable touch dragging on the board and pieces */
    #board { touch-action: none; -ms-touch-action: none; }
    #board img { -webkit-user-drag: none; touch-action: none; }

    /* Bot style buttons responsive grid */
    .bot-style-options { grid-template-columns: repeat(2, 1fr); }
}

/* Mobile-specific tweaks for add/view/train modes */
@media (max-width: 768px) {
    /* PGN/move list in Add Mode should scroll so played moves are visible */
    #add-mode #pgn-display {
        max-height: calc(40vh);
        overflow-y: auto;
        padding: 10px;
        border-radius: 8px;
        -webkit-overflow-scrolling: touch;
        background: var(--bg-input);
    }

    /* Make training progress area smaller so more of the card is visible */
    #train-mode .training-card { padding: 12px; }
    #train-mode .progress-container { height: 6px; }
    #train-mode .active-category-title { font-size: 1.1rem; }

    /* Center the primary view buttons and keep them static (not in fixed bottom bar) */
    #view-mode .action-group,
    #add-mode .action-group,
    #selection-mode .action-group,
    #import-pgn-mode .action-group,
    #bot-setup-mode .action-group {
        position: absolute;
        left: 12px;
        right: 12px;
        bottom: calc(16px + env(safe-area-inset-bottom));
        display: flex;
        justify-content: center;
        gap: 6px;
        margin-top: 0;
        padding: 0;
        background: none;
        backdrop-filter: none;
    }

    /* Compact action buttons in view mode */
    #view-mode .action-group .action-btn,
    #add-mode .action-group .action-btn,
    #selection-mode .action-group .action-btn,
    #import-pgn-mode .action-group .action-btn,
    #bot-setup-mode .action-group .action-btn {
        min-width: 90px;
        flex: 1;
    }

    /* Show board when in add/train/bot modes on mobile */
    body:has(#add-mode:not(.hidden)) .board-area,
    body:has(#train-mode:not(.hidden)) .board-area,
    body:has(#bot-play-mode:not(.hidden)) .board-area,
    body:has(#bot-setup-mode:not(.hidden)) .board-area {
        display: flex !important;
        flex: 0 0 45vh !important;
    }
}

/* Add-mode scrolling and limits (all screens) so played moves and notes remain visible */
#add-mode { overflow-y: auto; }
#add-mode-sections { display: flex; flex-direction: column; gap: var(--add-mode-gap); }
#add-mode-sections .add-mode-element { padding: calc(var(--add-mode-gap) / 4) 0; }
#add-mode-sections .add-mode-element > *:first-child { margin-bottom: 0; margin-top: 0; }
#add-mode #pgn-display { max-height: 50vh; overflow-y: auto; -webkit-overflow-scrolling: touch; margin-bottom: 0; }
#add-mode .note-input { max-height: 24vh; overflow-y: auto; margin-bottom: 0; margin-top: 0; }
#add-mode .analysis-section, #add-mode .explorer-section { margin-bottom: 0; }
#add-mode #category-input { margin-bottom: 0; }

/* Ensure action buttons in add mode always have gap to content above */
#add-mode .action-group { margin-top: var(--add-mode-gap); }

/* Ensure training card is centered on larger screens (override earlier rules) */
@media (min-width: 1024px) {
    #train-mode .training-dashboard { justify-content: center !important; align-items: center !important; }
    #train-mode .training-card { margin: 0 auto !important; max-width: 520px; }
}

/* CONTEXT MENU */
.context-menu {
    position: fixed;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    border-radius: 8px;
    padding: 5px 0;
    z-index: 20000;
    min-width: 160px;
}

.context-menu-item {
    padding: 10px 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-main);
    font-size: 0.9rem;
    transition: background 0.15s ease;
}
.context-menu-item .chess-icon {
    transition: color 0.15s ease;
}
.context-menu-item:hover {
    background: var(--bg-hover);
}
.context-menu-item:hover .chess-icon {
    color: var(--danger);
}

/* Blue icon for view position */
#ctx-view-position:hover .chess-icon {
    color: var(--primary);
}

/* Green icon for annotation */
#ctx-add-annotation:hover .chess-icon {
    color: var(--success);
}

/* Green hover for annotation submenu items (symbols only, no icons) */
.context-submenu .context-menu-item {
    transition: background 0.15s ease, color 0.15s ease;
}
.context-submenu .context-menu-item:hover {
    color: var(--success);
    background: var(--bg-hover);
}

.context-menu-item .chess-icon { width: 20px; text-align: center; }

.move-span {
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 4px;
    transition: background 0.2s;
}
.move-span:hover {
    background-color: var(--bg-hover);
    color: var(--primary);
}
.move-span.active-move {
    color: var(--primary);
    font-weight: 600;
}

/* Context submenu for annotations */
.context-submenu {
    border-top: 1px solid var(--border-color);
    margin-top: 4px;
    padding-top: 4px;
    max-height: 132px; /* Shows approximately 3 items */
    overflow-y: auto;
    overscroll-behavior: contain;
}
.context-submenu .context-menu-item {
    padding-left: 38px; /* align with icon spacing */
}

/* Opening Explorer Styles */
.explorer-section {
    background: var(--bg-input);
    border-radius: var(--radius);
    padding: 12px;
    margin-bottom: 15px;
    border: 1px solid var(--border-color);
}

.explorer-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: calc(var(--add-mode-gap) * 0.8);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.explorer-header .chess-icon {
    color: var(--primary);
}

.explorer-stats {
    margin-left: auto;
    font-size: 0.75rem;
    color: var(--text-muted);
}

.explorer-moves {
    display: flex;
    flex-direction: column;
    gap: calc(var(--add-mode-gap) / 3);
    max-height: calc(5 * 34px + 4 * 4px + 6px); /* 5 moves + gaps + buffer */
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-right: 4px;
}

.explorer-placeholder {
    text-align: center;
    color: var(--text-muted);
    font-size: 0.85rem;
    padding: 20px;
    font-style: italic;
}

.explorer-move {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    background: var(--bg-panel);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    border: 1px solid transparent;
}

.explorer-move:hover {
    background: var(--bg-hover);
    border-color: var(--primary);
    transform: translateX(2px);
}

.explorer-move-san {
    font-weight: 700;
    font-family: monospace;
    color: var(--text-main);
    min-width: 60px;
}

.explorer-move-bar {
    flex: 1;
    height: 18px;
    background: var(--bg-input);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    display: flex;
}

.explorer-bar-segment {
    height: 100%;
    transition: width 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 600;
    overflow: hidden;
    white-space: nowrap;
}

.explorer-bar-white {
    background: #e0e0e0;
    color: #333;
}

.explorer-bar-draw {
    background: #94a3b8;
    color: #fff;
}

.explorer-bar-black {
    background: #4a5568;
    color: #fff;
}

.explorer-move-stats {
    display: flex;
    gap: 6px;
    font-size: 0.7rem;
    color: var(--text-muted);
    min-width: 50px;
    justify-content: flex-end;
    align-items: center;
}

.explorer-move-games {
    font-weight: 600;
    color: var(--text-muted);
}

.explorer-loading {
    text-align: center;
    color: var(--primary);
    padding: 15px;
    font-size: 0.85rem;
}

.explorer-error {
    text-align: center;
    color: var(--danger);
    padding: 15px;
    font-size: 0.85rem;
}

.bot-setup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-shrink: 0;
}

.bot-setup-title {
    font-size: 1.1rem;
    margin: 0;
}

.bot-setup-card {
    margin-bottom: 20px;
}

.bot-line-preview {
    font-style: italic;
    margin-top: 10px;
    line-height: 1.4;
}

/* Bot style selection */
.bot-style-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin: 12px 0;
}

.bot-style-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 8px;
    background: var(--bg-input);
    border: 2px solid var(--border-color);
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-muted);
}

.bot-style-btn .chess-icon {
    font-size: 1.2rem;
}

.bot-style-btn span {
    font-size: 0.7rem;
    font-weight: 600;
}

.bot-style-btn:hover {
    border-color: var(--primary);
    color: var(--text-main);
}

.bot-style-btn.active {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
}

.bot-style-description {
    font-size: 0.8rem;
    color: white;
    text-align: center;
    min-height: 2.4em;
}

.bot-play-style {
    font-size: 0.85rem;
    color: var(--primary);
    font-weight: 600;
    margin-bottom: 8px;
}

/* Settings mode header */
.settings-mode-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-shrink: 0;
}

.settings-mode-header h2 {
    font-size: 1.1rem;
    margin: 0;
}

/* Data management section */
.data-management-box {
    background: var(--bg-input);
    padding: 15px;
    border-radius: var(--radius);
    text-align: center;
}

.data-management-box p {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 15px;
}

.data-management-actions {
    display: flex;
    gap: 10px;
}

#import-file {
    display: none;
}

/* Color dots for board theme options */
.color-dot {
    background: #769656;
}

/* Add mode header */
.add-mode-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    flex-shrink: 0;
}

.add-mode-header h2 {
    margin: 0;
    font-size: 1.1rem;
}

.add-mode-buttons {
    display: flex;
    gap: 8px;
}

/* Analyze button */
.analyze-btn {
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 6px 12px;
    font-size: 0.8rem;
    color: var(--text-main);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
}

.analyze-btn:hover {
    background: var(--bg-hover);
    border-color: var(--primary);
}

.analyze-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

.analyze-btn .chess-icon {
    font-size: 0.85rem;
}

/* Analysis section */
.analysis-section {
    background: var(--bg-input);
    border-radius: var(--radius);
    padding: 12px;
    margin-bottom: 15px;
    border: 1px solid var(--primary);
}

.analysis-controls {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;
}

#analysis-depth-select,
#analysis-lines-select {
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 3px 6px;
    font-size: 0.7rem;
    color: var(--text-main);
    cursor: pointer;
}

#analysis-depth-select:hover,
#analysis-lines-select:hover {
    border-color: var(--primary);
}

.analysis-depth {
    font-size: 0.75rem;
    color: var(--text-muted);
    min-width: 55px;
    text-align: right;
}

.analysis-move-eval {
    font-family: monospace;
    font-size: 0.8rem;
    font-weight: 600;
    min-width: 50px;
    text-align: center;
    padding: 2px 6px;
    border-radius: 4px;
}

.analysis-move-eval.positive {
    background: #f0f0f0;
    color: #1a1a1a;
}

.analysis-move-eval.negative {
    background: #2a2a2a;
    color: #f0f0f0;
}

.analysis-move-eval.neutral {
    background: #f0f0f0;
    color: #1a1a1a;
}

.analysis-line {
    flex-wrap: nowrap;
}

.analysis-pv {
    flex: 1;
    font-family: monospace;
    font-size: 0.75rem;
    color: var(--text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 8px;
}

/* PGN display */
#pgn-display {
    background: var(--bg-input);
    padding: 15px;
    border-radius: var(--radius);
    font-family: monospace;
    margin-bottom: 15px;
    flex-grow: 1;
    overflow-y: auto;
    font-size: 0.9rem;
    color: var(--text-main);
    min-height: 120px;
    line-height: 1.8;
}

/* Selection mode header */
.selection-mode-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: var(--add-mode-gap);
    flex-shrink: 0;
}
.selection-mode-header .color-switch {
    margin-bottom: 0;
    flex: 1;
}

/* Arrow button wrapper for popup positioning - hidden on desktop */
.arrow-btn-wrapper {
    position: relative;
    display: none;
}

/* Mobile arrow drawing button - shown via media query */
.mobile-arrow-btn.active {
    background: var(--primary) !important;
    color: var(--primary-text) !important;
}

/* Arrow color popup */
.arrow-color-popup {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 8px;
    display: flex;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 100;
}
.arrow-color-popup.hidden {
    display: none;
}
.arrow-color-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
}
.arrow-color-btn:hover {
    transform: scale(1.1);
}
.arrow-color-btn.active {
    border-color: var(--text-main);
}

/* Arrow draw mode highlight for first selected square */
.arrow-draw-start {
    box-shadow: inset 0 0 0 4px var(--primary) !important;
}

/* Bot accuracy stat */
#bot-accuracy {
    color: var(--text-muted);
}

/* Color dots for board theme options - specific colors */
.color-dot-green { background: #769656; }
.color-dot-brown { background: #b58863; }
.color-dot-blue { background: #8ca2ad; }
.color-dot-gray { background: #707070; }
.color-dot-purple { background: #8b5cf6; }
.color-dot-teal { background: #0d9488; }

/* Danger text color */
.danger-text {
    color: var(--danger);
}

/* Search filter icon */
.search-filter-icon {
    margin-right: 8px;
    color: var(--primary);
}

/* --- TREE VIEW STYLES --- */
.tree-container {
    font-family: 'Inter', 'Segoe UI', sans-serif;
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-main);
    padding: 5px;
}

.tree-line {
    display: block;
    margin-top: 6px;    /* CHANGED: Used to be margin-bottom */
    margin-bottom: 0;   /* Reset bottom margin */
}

/* Indentation for branches */
.tree-indent-level-0 { margin-left: 0; }
.tree-indent-level-1 { margin-left: 20px; border-left: 2px solid var(--border-color); padding-left: 8px; }
.tree-indent-level-2 { margin-left: 40px; border-left: 2px solid var(--border-color); padding-left: 8px; }
.tree-indent-level-3 { margin-left: 60px; border-left: 2px solid var(--border-color); padding-left: 8px; }
.tree-indent-level-4 { margin-left: 80px; border-left: 2px solid var(--border-color); padding-left: 8px; }
.tree-indent-level-5 { margin-left: 100px; border-left: 2px solid var(--border-color); padding-left: 8px; }

.tree-arrow {
    display: inline-block;
    /* "The sides should be the same length" */
    width: 14px;
    height: 14px;

    /* Create the L-shape using borders */
    border-left: 2px solid var(--text-muted);
    border-bottom: 2px solid var(--text-muted);

    /* Positioning */
    margin-right: 10px;
    margin-bottom: 4px; /* Adjusts alignment relative to text baseline */

    /* Reset old styles */
    transform: none;
    font-size: 0; /* Hides text if any remains inside */
    box-sizing: border-box;
}

.tree-move {
    font-weight: 600;
    color: var(--text-main);
    cursor: pointer;
    padding: 1px 4px;
    border-radius: 4px;
    transition: background 0.2s, color 0.2s;
}

.tree-move:hover {
    background: var(--bg-hover);
    color: var(--primary);
}

.tree-move-highlighted {
    color: var(--primary);
    background: rgba(59, 130, 246, 0.15);
}

.tree-move-highlighted-rep {
    color: var(--warning);
    background: rgba(245, 158, 11, 0.15);
}

.tree-dots {
    color: var(--text-muted);
    letter-spacing: 1px;
    margin: 0 4px;
}

/* The marker shown when a node represents a saved line */
.tree-line-marker {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-left: 6px;

    /* ÄNDERUNG: Kein Rahmen, kein Hintergrund */
    background: transparent;
    border: none;

    border-radius: 4px;
    color: var(--text-muted); /* Standardfarbe etwas dezenter */
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
    vertical-align: middle;
}

.tree-line-marker:hover {
    /* Beim Hover ein leichter Hintergrund statt Rahmen */
    background: var(--bg-hover);
    color: var(--primary);
    transform: scale(1.1);
}

.tree-line-marker.repetition {
    color: var(--warning);
}

/* Tree checkbox for selection mode */
.tree-line-checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-left: 4px;
    cursor: pointer;
    color: var(--text-muted);
    transition: color 0.2s, transform 0.2s;
    vertical-align: middle;
}

.tree-line-checkbox input[type="checkbox"] {
    display: none;
}

.tree-line-checkbox .chess-icon {
    font-size: 1rem;
}

.tree-line-checkbox:has(input:checked) {
    color: var(--success);
}



.tree-line-checkbox:hover {
    transform: scale(1.1);
}

.tree-line-checkbox.repetition:has(input:checked) {
    color: var(--warning);
}

.selection-tree .tree-move {
    cursor: default;
}

/* Selection checkbox for standard list view */
.selection-checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-right: 8px;
    cursor: pointer;
    color: var(--text-muted);
    transition: color 0.2s;
}

.selection-checkbox input[type="checkbox"] {
    display: none;
}

.selection-checkbox .chess-icon {
    font-size: 1rem;
}

.selection-checkbox:has(input:checked) {
    color: var(--success);
}



.selection-checkbox.repetition:has(input:checked) {
    color: var(--warning);
}

.selection-item {
    cursor: pointer;
}

/* Context menu for tree items */
.tree-action-menu {
    position: absolute;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    border-radius: 8px;
    padding: 5px;
    z-index: 10000;
    display: flex;
    gap: 5px;
    animation: fadeIn 0.2s ease;
}

.tree-action-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: 0.2s;
}

.tree-action-btn:hover { background: var(--bg-hover); color: var(--text-main); }
.tree-action-btn.edit:hover { color: var(--primary); }
.tree-action-btn.del:hover { color: var(--danger); }
.tree-action-btn.bot:hover { color: var(--success); }
.tree-action-btn.rep:hover { color: var(--warning); }

/* Hide list items when in tree mode */
.category-content.tree-mode .line-item { display: none; } /*Tree

/* --- PGN IMPORT MODE --- */
#import-pgn-mode { overflow-y: auto; }
#import-mode-sections { display: flex; flex-direction: column; gap: var(--add-mode-gap); }
#import-mode-sections .add-mode-element { padding: calc(var(--add-mode-gap) / 4) 0; }
#import-mode-sections .add-mode-element > *:first-child { margin-bottom: 0; margin-top: 0; }
#import-category-input { margin-bottom: 0; }

.import-pgn-textarea {
    min-height: 180px;
    max-height: 40vh;
    resize: vertical;
    font-family: 'Fira Code', 'Monaco', monospace;
    margin-bottom: 0;
    margin-top: 0;
}

.import-preview-section {
    border-radius: var(--radius);
    overflow: hidden;
    margin-bottom: 0;
}

.import-preview-section .explorer-moves {
    max-height: 25vh;
    overflow-y: auto;
}

/* Import lines use same styling as home page .line-item */
#import-lines-list .line-item {
    margin-bottom: 0;
}

.import-line-edit-input {
    flex: 1;
    background: var(--bg-panel);
    border: 2px solid var(--primary);
    border-radius: 6px;
    padding: 6px 10px;
    color: var(--text-main);
    font-family: 'Fira Code', 'Monaco', monospace;
    font-size: 0.85rem;
    outline: none;
}

#import-execute-btn:disabled {
    cursor: not-allowed;
}
`,Fg=`:root {
  --bg: #f8fafc; --surface: #fff; --text: #0f172a; --muted: #64748b;
  --border: #e2e8f0; --accent: #2563eb; --positive: #16a34a; --negative: #dc2626; --soft: #f1f5f9;
}
:root.dark {
  --bg: #090d16; --surface: #111827; --text: #f8fafc; --muted: #94a3b8;
  --border: #1f2937; --accent: #3b82f6; --positive: #22c55e; --negative: #ef4444; --soft: #182131;
  color-scheme: dark;
}
body, body.light-mode {
  --bg-body: var(--bg); --bg-panel: var(--surface); --bg-input: var(--soft); --bg-hover: var(--soft);
  --text-main: var(--text); --text-muted: var(--muted); --border-color: var(--border);
  --primary: var(--accent); --success: var(--positive); --danger: var(--negative);
  --resizer-bg: var(--border); --radius: 4px; --shadow: 0 1px 3px #00000008;
  height: 100dvh; background: var(--bg); color: var(--text); font-size: 13px;
}
*, *::before, *::after { transition-duration: 150ms !important; transition-timing-function: ease-out !important; animation: none !important; }
.main-container { height: 100dvh; padding: 18px; gap: 0; }
.board-area { min-width: 180px; padding: 24px; }
.board-wrapper { max-width: min(100%, calc(100dvh - 100px)); max-height: none; }
#board { box-shadow: none; border: 1px solid var(--border); }
.controls-area { min-width: 290px; border: 1px solid var(--border); }
.header-row { padding: 18px; }
h2 { font-family: Georgia, serif; font-weight: 500; }
button, input, textarea, select { font-family: inherit; font-size: 13px; }
button { min-height: 36px; border-radius: 4px; }
button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
input::placeholder, textarea::placeholder, .bot-style-description { color: var(--muted); }
.chess-icon { display: inline-block; width: 16px; height: 16px; vertical-align: middle; flex-shrink: 0; }
.settings-btn:hover { transform: none; }
.training-card, .results-card, .line-item, .category-group { box-shadow: none; border-color: var(--border); }
.results-icon { display: none; }
.results-card { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; }
.results-title { color: var(--text); }
.results-subtitle { color: var(--muted); }
#eval-bar-container { box-shadow: none; width: 22px; left: -28px; border-radius: 0; }
#view-mode, #settings-mode, #add-mode, #selection-mode, #train-mode, #bot-setup-mode, #bot-play-mode, #import-pgn-mode { padding: 16px; min-height: 0; }
@media (max-width: 767px) {
  body { overflow-y: auto; }
  .main-container { flex-direction: column; padding: 8px; height: auto; min-height: 100dvh; }
  .board-area { display: flex; flex: none !important; width: 100%; min-height: 0; padding: 10px 28px; }
  .board-wrapper { width: 100%; height: auto; max-width: min(100%, 48dvh); }
  #board { width: 100%; height: auto; }
  .controls-area { padding: 0; padding-bottom: env(safe-area-inset-bottom); }
  .board-area.mobile-visible ~ .controls-area { height: 52dvh; }
  .mobile-board-toggle { display: none; }
  .view-mode-header .analyze-btn { display: flex; }
  .controls-area { width: 100%; min-width: 0; min-height: 320px; height: 52dvh; flex: none; }
  .resizer { display: none; }
  .action-btn { min-height: 44px; padding: 10px; }
  .bot-style-options { grid-template-columns: repeat(2, 1fr); }
}
.explorer-auth { display: grid; grid-template-columns: 1fr auto; gap: 8px; padding: 12px; border-bottom: 1px solid var(--border); }
.explorer-auth label { grid-column: 1 / -1; color: var(--muted); font-size: 11px; }
.explorer-auth input { min-width: 0; width: 100%; }
.explorer-auth a { align-self: center; color: var(--accent); font-size: 11px; }
.selection-checkbox input[type="checkbox"], .tree-line-checkbox input[type="checkbox"] { display: inline-block; width: 17px; height: 17px; accent-color: var(--accent); }
.selection-checkbox .chess-icon, .tree-line-checkbox .chess-icon { display: none; }
.category-header .icon-chevron-right { margin-right: 10px; }
`;function Li(d){return`<script>${d.replace(/<\/script/gi,"<\\/script")}<\/script>`}function Pg(){const d=document.querySelector("script[data-app-entry]");return`<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="${(d?new URL("../",d.src):new URL("./",document.baseURI)).href}"><link rel="stylesheet" href="vendor/chessboard.min.css"><style>${Wg}
${Fg}</style></head><body>${Xg}${Li($g)}<script src="vendor/jquery.min.js"><\/script><script src="vendor/chessboard.min.js"><\/script><script src="vendor/chess.min.js"><\/script>${Li(Kg)}${Li(Zg)}${Li(Qg)}${Li(Jg)}</body></html>`}function eh({active:d,theme:g,toggleTheme:E}){const c=B.useRef(null),[b]=B.useState(Pg),[M,_]=B.useState(!1);return B.useEffect(()=>{const A=L=>{L.source===c.current?.contentWindow&&(L.data?.type==="erudite-chess-ready"&&_(!0),L.data?.type==="erudite-chess-theme"&&E())};return window.addEventListener("message",A),()=>window.removeEventListener("message",A)},[E]),B.useEffect(()=>{M&&c.current?.contentWindow?.postMessage({type:"erudite-chess-state",active:d,theme:g},"*")},[d,g,M]),r.jsxs("section",{className:"chess-workspace",hidden:!d,"aria-label":"Chess opening trainer",children:[!M&&r.jsx("p",{role:"status",children:"Loading chess workspace…"}),r.jsx("iframe",{ref:c,title:"Chess opening trainer",srcDoc:b})]})}const Ll=Mg();function nh(){const[d,g]=B.useState(()=>{try{return localStorage.getItem("erudite_active_app_mode")==="chess"?"chess":"words"}catch{return"words"}}),[E,c]=B.useState(d==="chess"),b=J=>{g(J),J==="chess"&&c(!0);try{localStorage.setItem("erudite_active_app_mode",J)}catch{}},[M,_]=B.useState(Ll.data),[A,L]=B.useState(Ll.error),[S,N]=B.useState("learn"),[y,Z]=B.useState(0),[ce,ue]=B.useState(null),X=M.settings,Q=wg(X.interfaceLanguage),ge=cu(X.sourceLanguage,X.targetLanguage),O=M.pairs[ge]??Cl(X.sourceLanguage,X.targetLanguage);B.useEffect(()=>{Ll.error&&M===Ll.data||L(!Cg(M))},[M]),B.useEffect(()=>{document.documentElement.classList.toggle("dark",X.theme==="dark"),document.documentElement.lang=X.interfaceLanguage,document.querySelector('meta[name="theme-color"]')?.setAttribute("content",X.theme==="dark"?"#090D16":"#F8FAFC")},[X.theme,X.interfaceLanguage]);const Se=J=>_(Ee=>{const Me={...Ee.settings,...J},H=cu(Me.sourceLanguage,Me.targetLanguage);return{...Ee,settings:Me,pairs:{...Ee.pairs,[H]:Ee.pairs[H]??Cl(Me.sourceLanguage,Me.targetLanguage)}}}),me=(J,Ee)=>_(Me=>({...Me,reviewOrder:Ee??Me.reviewOrder,pairs:{...Me.pairs,[ge]:J}})),ye=J=>{ue({pairKey:ge,selection:J}),N("learn")},Ne=J=>{J==="learn"&&ue(null),N(J)},Y=[{id:"learn",icon:ra},{id:"categories",icon:dg},{id:"add",icon:fr},{id:"settings",icon:gg}],ee=r.jsxs("div",{className:"app-mode-switch",role:"group","aria-label":"Application mode",children:[r.jsxs("button",{type:"button","aria-pressed":d==="words",onClick:()=>b("words"),children:[r.jsx(ra,{size:15}),"Words"]}),r.jsxs("button",{type:"button","aria-pressed":d==="chess",onClick:()=>b("chess"),children:[r.jsx(rg,{size:15}),"Chess"]})]});return r.jsxs("div",{className:`app-shell mode-${d}`,children:[r.jsxs("aside",{className:"sidebar",children:[r.jsxs("a",{className:"brand",href:"#",onClick:J=>{J.preventDefault(),Ne("learn")},children:[r.jsxs("span",{className:"brand-mark",children:["E",r.jsx("span",{})]}),r.jsxs("span",{children:["erudite",r.jsx("span",{className:"brand-period",children:"."})]})]}),ee,r.jsx("p",{className:"brand-tagline",children:Q("tagline")}),r.jsx("p",{className:"nav-caption",children:Q("workspace")}),d==="chess"&&r.jsxs("p",{className:"chess-sidebar-note",children:["Opening repertoires",r.jsx("br",{}),"Line training",r.jsx("br",{}),"Stockfish analysis"]}),r.jsx("nav",{hidden:d!=="words","aria-label":Q("workspace"),children:Y.map(({id:J,icon:Ee})=>r.jsxs("button",{className:`nav-item ${S===J?"active":""}`,"aria-current":S===J?"page":void 0,onClick:()=>Ne(J),children:[r.jsx(Ee,{size:19}),r.jsx("span",{children:Q(J)}),S===J&&r.jsx("span",{className:"nav-active-mark"})]},J))}),r.jsxs("div",{className:"sidebar-footer",children:[r.jsxs("div",{className:"sidebar-pair",hidden:d!=="words",children:[r.jsx("span",{className:"language-code",children:X.targetLanguage.toUpperCase()}),r.jsxs("div",{children:[r.jsx("strong",{children:sa[X.targetLanguage]}),r.jsxs("span",{children:[sa[X.sourceLanguage],r.jsx(zt,{size:12}),sa[X.targetLanguage]]})]})]}),r.jsxs("div",{className:"local-note",children:[r.jsx(hg,{size:15}),r.jsx("span",{children:Q("local")})]})]})]}),r.jsxs("div",{className:"main-shell",children:[r.jsxs("header",{className:"topbar",children:[r.jsxs("span",{className:"breadcrumb",children:[Q("workspace"),r.jsx("span",{children:"/"}),r.jsx("strong",{children:d==="chess"?"Chess":Q(S)})]}),r.jsxs("div",{className:"mobile-mode-brand",children:[r.jsx("span",{className:"mobile-brand",children:"erudite."}),ee]}),r.jsxs("div",{className:"topbar-actions",children:[r.jsxs("div",{className:"header-language",hidden:d!=="words",children:[r.jsx("span",{className:"language-code",children:X.targetLanguage.toUpperCase()}),r.jsx("select",{"aria-label":Q("target"),value:X.targetLanguage,onChange:J=>Se({targetLanguage:J.target.value}),children:Rt.filter(J=>J!==X.sourceLanguage).map(J=>r.jsx("option",{value:J,children:sa[J]},J))}),r.jsx(au,{size:14})]}),r.jsx("span",{className:"header-divider"}),r.jsx("button",{className:"icon-button","aria-label":X.theme==="light"?Q("dark"):Q("light"),title:X.theme==="light"?Q("dark"):Q("light"),onClick:()=>Se({theme:X.theme==="light"?"dark":"light"}),children:X.theme==="light"?r.jsx(fg,{size:19}):r.jsx(vg,{size:19})})]})]}),E&&r.jsx(eh,{active:d==="chess",theme:X.theme,toggleTheme:()=>Se({theme:X.theme==="light"?"dark":"light"})}),r.jsxs("main",{hidden:d!=="words",className:`main-content page-${S}`,children:[A&&r.jsx("div",{className:"storage-error",role:"alert",children:Q("storageError")}),S==="learn"&&r.jsx(Gg,{initialSelection:ce?.pairKey===ge?ce.selection:void 0,active:d==="words",pair:O,settings:X,reviewOrder:M.reviewOrder,update:me,t:Q,openLibrary:()=>N("categories"),changeSettings:Se},JSON.stringify(ce?.pairKey===ge?ce.selection:null))," ",S==="categories"&&r.jsx(Vg,{pair:O,settings:X,update:me,t:Q,onPractice:ye})," ",S==="add"&&r.jsx(vu,{pair:O,settings:X,update:me,t:Q,onPractice:ye})," ",S==="settings"&&r.jsx(Yg,{data:M,changeSettings:Se,restore:J=>{_(J),ue(null),Z(Ee=>Ee+1)},t:Q})]},`${ge}-${y}`),r.jsxs("footer",{className:"desktop-footer",hidden:d!=="words",children:[r.jsx("span",{children:"ERUDITE"}),r.jsx("span",{children:Q("tagline")}),r.jsxs("span",{children:[O.words.length," ",Q("total").toLocaleLowerCase(X.interfaceLanguage)]})]})]}),r.jsx("nav",{className:"bottom-nav",hidden:d!=="words","aria-label":Q("workspace"),children:Y.map(({id:J,icon:Ee})=>r.jsxs("button",{className:S===J?"active":"","aria-current":S===J?"page":void 0,onClick:()=>Ne(J),children:[r.jsx(Ee,{size:21}),r.jsx("span",{children:Q(J)})]},J))})]})}Pp.createRoot(document.getElementById("root")).render(r.jsx(Xp.StrictMode,{children:r.jsx(nh,{})}))})();
