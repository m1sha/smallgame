export type AnimationTriggerCallback = () => boolean

export type AnimationTransition = { 
  from: string, 
  to: string, 
  trigger: AnimationTriggerCallback, 
  flipX?: AnimationTriggerCallback, 
  flipY?: AnimationTriggerCallback
}

