var vertexShaderPlane = [
"vec4 mod289(vec4 x)",
"{",
"	return x - floor(x * (1.0 / 289.0)) * 289.0;",
"}",
"",
"vec4 permute(vec4 x)",
"{",
"	return mod289(((x*34.0)+1.0)*x);",
"}",
"",
"vec4 taylorInvSqrt(vec4 r)",
"{",
"	return 1.79284291400159 - 0.85373472095314 * r;",
"}",
"",
"vec2 fade(vec2 t) {",
"	return t*t*t*(t*(t*6.0-15.0)+10.0);",
"}",
"",
"// Classic Perlin noise",
"float cnoise(vec2 P)",
"{",
"	vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);",
"	vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);",
"	Pi = mod289(Pi); // To avoid truncation effects in permutation",
"	vec4 ix = Pi.xzxz;",
"	vec4 iy = Pi.yyww;",
"	vec4 fx = Pf.xzxz;",
"	vec4 fy = Pf.yyww;",
"",
"	vec4 i = permute(permute(ix) + iy);",
"",
"	vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;",
"	vec4 gy = abs(gx) - 0.5 ;",
"	vec4 tx = floor(gx + 0.5);",
"	gx = gx - tx;",
"",
"	vec2 g00 = vec2(gx.x,gy.x);",
"	vec2 g10 = vec2(gx.y,gy.y);",
"	vec2 g01 = vec2(gx.z,gy.z);",
"	vec2 g11 = vec2(gx.w,gy.w);",
"",
"	vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));",
"	g00 *= norm.x;  ",
"	g01 *= norm.y;  ",
"	g10 *= norm.z;  ",
"	g11 *= norm.w;  ",
"",
"	float n00 = dot(g00, vec2(fx.x, fy.x));",
"	float n10 = dot(g10, vec2(fx.y, fy.y));",
"	float n01 = dot(g01, vec2(fx.z, fy.z));",
"	float n11 = dot(g11, vec2(fx.w, fy.w));",
"",
"	vec2 fade_xy = fade(Pf.xy);",
"	vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);",
"	float n_xy = mix(n_x.x, n_x.y, fade_xy.y);",
"	return 2.3 * n_xy;",
"}",
"",
"// Classic Perlin noise, periodic variant",
"float pnoise(vec2 P, vec2 rep)",
"{",
"	vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);",
"	vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);",
"	Pi = mod(Pi, rep.xyxy); // To create noise with explicit period",
"	Pi = mod289(Pi);        // To avoid truncation effects in permutation",
"	vec4 ix = Pi.xzxz;",
"	vec4 iy = Pi.yyww;",
"	vec4 fx = Pf.xzxz;",
"	vec4 fy = Pf.yyww;",
"",
"	vec4 i = permute(permute(ix) + iy);",
"",
"	vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;",
"	vec4 gy = abs(gx) - 0.5 ;",
"	vec4 tx = floor(gx + 0.5);",
"	gx = gx - tx;",
"",
"	vec2 g00 = vec2(gx.x,gy.x);",
"	vec2 g10 = vec2(gx.y,gy.y);",
"	vec2 g01 = vec2(gx.z,gy.z);",
"	vec2 g11 = vec2(gx.w,gy.w);",
"",
"	vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));",
"	g00 *= norm.x;  ",
"	g01 *= norm.y;  ",
"	g10 *= norm.z; ", 
"	g11 *= norm.w;  ",
"",
"	float n00 = dot(g00, vec2(fx.x, fy.x));",
"	float n10 = dot(g10, vec2(fx.y, fy.y));",
"	float n01 = dot(g01, vec2(fx.z, fy.z));",
"	float n11 = dot(g11, vec2(fx.w, fy.w));",
"",
"	vec2 fade_xy = fade(Pf.xy);",
"	vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);",
"	float n_xy = mix(n_x.x, n_x.y, fade_xy.y);",
"	return 2.3 * n_xy;",
"}",
"",
"varying vec3 vNormal;",
"varying vec3 vPos;",
"varying vec2 mUV;",
"uniform float time;",
"",
"float findNoise(vec2 P)",
"{",
"	float fs = cnoise(4.0*P);",
"	fs += cnoise(8.0*P)/2.0;",
"	return 100.0 * fs;",
"}",
"",
"void main()",
"{",
"",
"	mUV = uv + vec2(time*0.001, 0.0);",
"	float n = findNoise(mUV);",
"",
"	vec3 dispPos =  vec3(position + normal * n);",
"",
"	vec4 modelViewPosition = modelViewMatrix * vec4(dispPos, 1.0);",
"	vPos = modelViewPosition.xyz;",
"	gl_Position = projectionMatrix * modelViewPosition;",
"}",
].join("\n");
var fragmentShaderPlane = [
"#extension GL_OES_standard_derivatives : enable",
"varying vec3 vPos;",
"varying vec2 mUV;",
"uniform float time;",
"uniform vec3 diffuse;",
"uniform vec3 fogColor;",
"uniform float fogNear;",
"uniform float fogFar;",
"",
"struct PointLight {",
"	vec3 position;",
"	vec3 color;",
"};",
"",
"uniform PointLight pointLights[ NUM_POINT_LIGHTS ];",
"",
"void main() {",
"",
"", //Compute the actual normal after displacement
"	vec3 vNormal = normalize(cross(dFdx(vPos), dFdy(vPos)));",
"",
"", //Add diffuse light contribution from each lightsource
"	vec4 addedLights = vec4(0.2, 0.40, 0.2, 1.0);",
"	for(int i = 0; i < NUM_POINT_LIGHTS; i++)",
"	{",
"		vec3 lightDirection = normalize(pointLights[i].position - vPos);",
"		addedLights.rgb += clamp(dot(lightDirection, vNormal), 0.0, 1.0) * pointLights[i].color;",
"	}",
"",
"	gl_FragColor = addedLights;",
"",
"", //Fog
"	#ifdef USE_FOG",
" 		#ifdef USE_LOGDEPTHBUF_EXT",
" 			float depth = gl_FragDepthEXT / gl_FragCoord.w;",
" 		#else",
" 			float depth = gl_FragCoord.z / gl_FragCoord.w;",
" 		#endif",
" 		float fogFactor = smoothstep(fogNear, fogFar, depth);",
" 		gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);",
" 	#endif",
"}",
].join("\n");