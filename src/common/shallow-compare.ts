import React from 'react';

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
 export function shallowEqual(objA: object, objB: object): boolean {
    if (objA === objB) {
      return true;
    }
  
    if (typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null) {
      return false;
    }
  
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
  
    if (keysA.length !== keysB.length) {
      return false;
    }
  
    // Test for A's keys different from B.
    for (let i = 0; i < keysA.length; i++) {
      if (!objB.hasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
        return false;
      }
    }
  
    return true;
  }
  
  export function shallowCompare<P, S>(instance: React.Component<P, S>, nextProps: Readonly<P>, nextState: Readonly<S>) {
    return (
      !shallowEqual(instance.props, nextProps) || !shallowEqual(instance.state, nextState)
    );
  }