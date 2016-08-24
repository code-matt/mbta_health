class Event < ActiveRecord::Base
  validates :stop_sequence, :sch_arr_dt, :sch_dep_dt, :mbta_stop_id, :stop_name, presence: true
  belongs_to :trip

  def self.parse_trip_name(txt)
    re1='.*?'	# Non-greedy match on filler
    re2='(\\(.*\\))'	# Round Braces 1

    re=(re1+re2)
    m=Regexp.new(re,Regexp::IGNORECASE);
    if m.match(txt)
        rbraces1=m.match(txt)[1];
        return rbraces1
    end
    false
  end
end