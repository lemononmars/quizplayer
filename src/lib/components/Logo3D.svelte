<script>
   import { CircleBufferGeometry, MeshStandardMaterial, Color, DoubleSide, ExtrudeBufferGeometry, Shape } from 'three'
   import { DEG2RAD } from 'three/src/math/MathUtils'
   import {
     AmbientLight,
     Canvas,
     DirectionalLight,
     Group,
     Mesh,
     OrbitControls,
     PerspectiveCamera
   } from 'threlte'
   import { spring } from 'svelte/motion'
 
   const scale = spring(1)

   let outer = new Shape()
   outer.moveTo(0,0)
    .lineTo(0, 6)
    .lineTo(1, 5)
    .lineTo(1, 1)
    .lineTo(5, 1)
    .lineTo(5, 5)
    .lineTo(6, 6)
    .lineTo(6, 0)
    .lineTo(0, 0)

    let inner = new Shape()
    inner.moveTo(2,2)
      .lineTo(2, 4)
      .lineTo(3,3)
      .lineTo(4,4)
      .lineTo(4,2)
      .lineTo(2,2)

    let triangle = new Shape()
    triangle.moveTo(1,6)
      .lineTo(3,4)
      .lineTo(5,6)
      .lineTo(1,6)

    let settings = {
      depth: 1
    }

    let value = 0
    let myColor = new Color("hsl(0, 100%, 50%)")
    let material = new MeshStandardMaterial({ color: myColor })

    setInterval(()=>{
      value += 0.01
      if(value > 1) value -= 1
      myColor.setHSL(value, 1, 0.5)
      material.color = myColor
    }, 100)
 </script>
 
 <div class="w-full h-screen">
   <Canvas>
     <PerspectiveCamera position={{ x: 0, y: 0, z: -40 }} fov={24}>
       <OrbitControls
         maxPolarAngle={DEG2RAD * 80}
         autoRotate={true}
         enableZoom={true}
         target={{ y: 0.5 }}
       />
     </PerspectiveCamera>
 
     <DirectionalLight shadow position={{ x: 3, y: 10, z: 10 }} />
     <DirectionalLight position={{ x: -3, y: 10, z: -10 }} intensity={0.2} />
     <AmbientLight intensity={0.5} />
 
     <!-- Cube -->
     <Group 
      scale={$scale}
      rotation={{z: DEG2RAD * 90}}
      position={{x:2.5}}
    >
      <Mesh
        interactive
        on:pointerenter={() => ($scale = 1.2)}
        on:pointerleave={() => ($scale = 1)}
        castShadow
        geometry={new ExtrudeBufferGeometry(outer, settings)}
        material={material}
      />
      <Mesh
        castShadow
        geometry={new ExtrudeBufferGeometry(inner, settings)}
        material={material}
      />
      <Mesh
        castShadow
        geometry={new ExtrudeBufferGeometry(triangle, settings)}
        material={material}
      />
     </Group>
 
     <!-- Floor -->
     <Mesh
       receiveShadow
       rotation={{ x: -90 * (Math.PI / 180) }}
       position={{y:-1}}
       geometry={new CircleBufferGeometry(3, 72)}
       material={new MeshStandardMaterial({ side: DoubleSide, color: 'white' })}
     />
   </Canvas>
 </div>
 