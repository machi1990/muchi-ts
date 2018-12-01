interface AnnotationOpts {
  ignore?: boolean;
}

export interface TestClassOpts extends AnnotationOpts {
  name: string;
}

export interface TestMethodOpts extends AnnotationOpts {
  it: string;
}

export interface ContextClassOpts extends AnnotationOpts {
  when: string;
  englobingClass: any;
  englobingInstanceAttributes: Array<string>;
}
