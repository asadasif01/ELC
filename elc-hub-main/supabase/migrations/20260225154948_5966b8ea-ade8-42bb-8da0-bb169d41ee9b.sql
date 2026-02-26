
-- Create course_content table for lessons/materials
CREATE TABLE public.course_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_content ENABLE ROW LEVEL SECURITY;

-- Anyone can view content of published courses
CREATE POLICY "Anyone can view course content"
ON public.course_content FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND published = true)
  OR public.has_role(auth.uid(), 'admin')
);

-- Admins can manage content
CREATE POLICY "Admins can insert course content"
ON public.course_content FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update course content"
ON public.course_content FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course content"
ON public.course_content FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Track content completion by students
CREATE TABLE public.content_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_id UUID NOT NULL REFERENCES public.course_content(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_id)
);

ALTER TABLE public.content_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
ON public.content_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
ON public.content_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
ON public.content_progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
ON public.content_progress FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on course_content
CREATE TRIGGER update_course_content_updated_at
BEFORE UPDATE ON public.course_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
