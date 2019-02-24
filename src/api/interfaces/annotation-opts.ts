interface AnnotationOpts {
  ignore?: boolean;
}

export interface TestClassOpts extends AnnotationOpts {
  name: string;
}

interface MethodAnnotationOpts extends AnnotationOpts {
  only?: boolean;
}
export interface TestMethodOpts extends MethodAnnotationOpts {
  it: string;
}

export interface ContextClassOpts extends MethodAnnotationOpts {
  when: string;
}
